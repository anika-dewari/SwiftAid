import pool from '../db.js';
import { notifyTripCompleted } from '../services/twilioService.js';

// Get driver profile (for authenticated driver)
export const getDriverProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT 
        dp.*,
        u.email,
        u.full_name,
        u.phone as user_phone
      FROM driver_profiles dp
      JOIN users u ON dp.user_id = u.id
      WHERE dp.user_id = $1
    `;
    let result = await pool.query(query, [userId]);

    // If profile doesn't exist, return empty profile object (will be created on first update)
    if (result.rows.length === 0) {
      console.log('⚠️  No driver profile found for user:', userId);
      console.log('📝 Profile will be created when driver updates their information');
      
      // Return a default profile structure
      const userQuery = await pool.query(
        'SELECT email, full_name, phone FROM users WHERE id = $1',
        [userId]
      );
      
      const defaultProfile = {
        user_id: userId,
        email: userQuery.rows[0]?.email,
        full_name: userQuery.rows[0]?.full_name,
        user_phone: userQuery.rows[0]?.phone,
        status: 'offline',
        rating: 5.0,
        total_trips: 0,
        license_number: null,
        vehicle_type: null,
        vehicle_number: null,
        vehicle_model: null,
        experience_years: null
      };
      
      return res.json({ driver: defaultProfile });
    }

    res.json({ driver: result.rows[0] });
  } catch (err) {
    console.error('Get driver profile error:', err);
    res.status(500).json({ error: 'Failed to fetch driver profile' });
  }
};

// Update driver profile (for authenticated driver)
export const updateDriverProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      license_number,
      vehicle_type,
      vehicle_number,
      vehicle_model,
      experience_years,
      bio,
      current_latitude,
      current_longitude
    } = req.body;

    // Use UPSERT (INSERT ... ON CONFLICT UPDATE) to create or update profile
    const query = `
      INSERT INTO driver_profiles (
        user_id, license_number, vehicle_type, vehicle_number, 
        vehicle_model, experience_years, bio, current_latitude, current_longitude, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'offline')
      ON CONFLICT (user_id)
      DO UPDATE SET
        license_number = COALESCE($2, driver_profiles.license_number),
        vehicle_type = COALESCE($3, driver_profiles.vehicle_type),
        vehicle_number = COALESCE($4, driver_profiles.vehicle_number),
        vehicle_model = COALESCE($5, driver_profiles.vehicle_model),
        experience_years = COALESCE($6, driver_profiles.experience_years),
        bio = COALESCE($7, driver_profiles.bio),
        current_latitude = COALESCE($8, driver_profiles.current_latitude),
        current_longitude = COALESCE($9, driver_profiles.current_longitude)
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId,
      license_number,
      vehicle_type,
      vehicle_number,
      vehicle_model,
      experience_years,
      bio,
      current_latitude,
      current_longitude
    ]);

    res.json({ 
      message: 'Profile updated successfully',
      driver: result.rows[0] 
    });
  } catch (err) {
    console.error('Update driver profile error:', err);
    res.status(500).json({ error: 'Failed to update driver profile' });
  }
};

// Update driver status (available, busy, offline)
export const updateDriverStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, latitude, longitude } = req.body;

    if (!['available', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Fetch current driver profile to determine previous status
    const existing = await pool.query('SELECT id, status FROM driver_profiles WHERE user_id = $1', [userId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    const prevStatus = existing.rows[0].status;
    const driverId = existing.rows[0].id;

    // Update driver status
    const updateQuery = `
      UPDATE driver_profiles
      SET 
        status = $1,
        current_latitude = COALESCE($2, current_latitude),
        current_longitude = COALESCE($3, current_longitude)
      WHERE user_id = $4
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [status, latitude, longitude, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    // Log status change in history
    await pool.query(
      `INSERT INTO driver_status_history (driver_id, status, latitude, longitude)
       VALUES ($1, $2, $3, $4)`,
      [result.rows[0].id, status, latitude, longitude]
    );

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('driver-status-changed', {
        driverId: result.rows[0].id,
        userId: userId,
        status: status,
        location: { latitude, longitude }
      });
    }

    // If driver is transitioning from busy -> available, mark one active trip as completed
    try {
      if (prevStatus === 'busy' && status === 'available') {
        // Find the most recent active request assigned to this driver
        const activeReq = await pool.query(
          `SELECT * FROM emergency_requests WHERE driver_id = $1 AND status IN ('accepted','in_progress') ORDER BY created_at DESC LIMIT 1`,
          [driverId]
        );

        if (activeReq.rows.length > 0) {
          const request = activeReq.rows[0];

          // Mark request as completed
          const completed = await pool.query(
            `UPDATE emergency_requests SET status = $1, completed_at = NOW() WHERE id = $2 RETURNING *`,
            ['completed', request.id]
          );

          // Increment driver's total_trips counter (if present)
          await pool.query(
            `UPDATE driver_profiles SET total_trips = COALESCE(total_trips,0) + 1 WHERE id = $1`,
            [driverId]
          );

          // Notify user/driver about completion (best-effort)
          try {
            const durationMins = Math.round((new Date() - new Date(request.created_at)) / 60000);
            if (request.patient_phone) {
              await notifyTripCompleted(request.patient_phone, request.patient_name || 'Patient', durationMins);
            }
            // Notify driver (if phone available in profile)
            const driverPhoneRes = await pool.query('SELECT u.phone FROM driver_profiles dp JOIN users u ON dp.user_id = u.id WHERE dp.id = $1', [driverId]);
            if (driverPhoneRes.rows[0] && driverPhoneRes.rows[0].phone) {
              await notifyTripCompleted(driverPhoneRes.rows[0].phone, driverPhoneRes.rows[0].phone, durationMins).catch(() => {});
            }
          } catch (notifyErr) {
            console.error('Error sending trip-completed notifications:', notifyErr.message || notifyErr);
          }

          // Emit event about request status update
          if (req.io && request.user_id) {
            req.io.to(`user_${request.user_id}`).emit('request-status-updated', {
              requestId: request.id,
              status: 'completed'
            });
          }
        }
      }
    } catch (innerErr) {
      console.error('Error while finalizing active trip on status change:', innerErr);
    }
    res.json({ 
      message: 'Status updated successfully',
      driver: result.rows[0] 
    });
  } catch (err) {
    console.error('Update driver status error:', err);
    res.status(500).json({ error: 'Failed to update driver status' });
  }
};

// Get all drivers (for users/admin to view available drivers)
export const getAllDrivers = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT 
        dp.id,
        dp.user_id,
        dp.license_number,
        dp.vehicle_type,
        dp.vehicle_number,
        dp.vehicle_model,
        dp.experience_years,
        dp.status,
        dp.current_latitude,
        dp.current_longitude,
        dp.rating,
        dp.total_trips,
        dp.is_verified,
        u.full_name,
        u.phone,
        u.email
      FROM driver_profiles dp
      JOIN users u ON dp.user_id = u.id
    `;

    const params = [];
    if (status) {
      query += ' WHERE dp.status = $1';
      params.push(status);
    }

    query += ' ORDER BY dp.rating DESC, dp.total_trips DESC';

    const result = await pool.query(query, params);
    res.json({ drivers: result.rows });
  } catch (err) {
    console.error('Get all drivers error:', err);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
};

// Get available drivers (for emergency requests)
export const getAvailableDrivers = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    let query = `
      SELECT 
        dp.*,
        u.full_name,
        u.phone,
        u.email
      FROM driver_profiles dp
      JOIN users u ON dp.user_id = u.id
      WHERE dp.status = 'available'
    `;

    const params = [];

    // If location is provided, calculate distance and filter by radius
    if (latitude && longitude) {
      query += `
        AND (
          6371 * acos(
            cos(radians($1)) * cos(radians(dp.current_latitude)) *
            cos(radians(dp.current_longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(dp.current_latitude))
          )
        ) <= $3
        ORDER BY (
          6371 * acos(
            cos(radians($1)) * cos(radians(dp.current_latitude)) *
            cos(radians(dp.current_longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(dp.current_latitude))
          )
        ) ASC
      `;
      params.push(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));
    } else {
      query += ' ORDER BY dp.rating DESC';
    }

    const result = await pool.query(query, params);
    res.json({ drivers: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('Get available drivers error:', err);
    res.status(500).json({ error: 'Failed to fetch available drivers' });
  }
};

// Get driver by ID (public info)
export const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        dp.*,
        u.full_name,
        u.phone,
        u.email
      FROM driver_profiles dp
      JOIN users u ON dp.user_id = u.id
      WHERE dp.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({ driver: result.rows[0] });
  } catch (err) {
    console.error('Get driver by ID error:', err);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
};

// Get driver statistics
export const getDriverStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const driverQuery = await pool.query(
      'SELECT id FROM driver_profiles WHERE user_id = $1',
      [userId]
    );

    // If no driver profile exists, return default stats
    if (driverQuery.rows.length === 0) {
      console.log('No driver profile found, returning default stats for user:', userId);
      return res.json({ 
        stats: {
          completed_trips: 0,
          cancelled_trips: 0,
          active_trips: 0,
          avg_completion_time_minutes: null
        }
      });
    }

    const driverId = driverQuery.rows[0].id;

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE status = 'completed') as completed_trips,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_trips,
        COUNT(*) FILTER (WHERE status IN ('accepted', 'in_progress')) as active_trips,
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/60) FILTER (WHERE status = 'completed') as avg_completion_time_minutes
      FROM emergency_requests
      WHERE driver_id = $1
    `;

    const statsResult = await pool.query(statsQuery, [driverId]);

    res.json({ 
      stats: statsResult.rows[0]
    });
  } catch (err) {
    console.error('Get driver stats error:', err);
    res.status(500).json({ error: 'Failed to fetch driver statistics' });
  }
};

// Legacy functions for backwards compatibility
export const addDriver = async (req, res) => {
  res.status(400).json({ 
    message: 'Please use the registration endpoint to create a driver account',
    endpoint: 'POST /api/auth/register with role: driver'
  });
};

export const getDrivers = getAllDrivers;
export const updateDriver = updateDriverProfile;
export const deleteDriver = async (req, res) => {
  res.status(400).json({ 
    message: 'Driver deletion should be done through user management',
    endpoint: 'DELETE /api/users/:id (admin only)'
  });
};
