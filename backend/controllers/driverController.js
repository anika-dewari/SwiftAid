import pool from '../db.js';

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
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Driver profile not found' });
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

    const query = `
      UPDATE driver_profiles
      SET 
        license_number = COALESCE($1, license_number),
        vehicle_type = COALESCE($2, vehicle_type),
        vehicle_number = COALESCE($3, vehicle_number),
        vehicle_model = COALESCE($4, vehicle_model),
        experience_years = COALESCE($5, experience_years),
        bio = COALESCE($6, bio),
        current_latitude = COALESCE($7, current_latitude),
        current_longitude = COALESCE($8, current_longitude)
      WHERE user_id = $9
      RETURNING *
    `;

    const result = await pool.query(query, [
      license_number,
      vehicle_type,
      vehicle_number,
      vehicle_model,
      experience_years,
      bio,
      current_latitude,
      current_longitude,
      userId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

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

    if (driverQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Driver profile not found' });
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
