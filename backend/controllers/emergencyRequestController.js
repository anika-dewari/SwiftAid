import pool from '../db.js';
import { createNotification } from './notificationController.js';

// ✅ Add a new emergency request
export const addEmergencyRequest = async (req, res) => {
  try {
    const userId = req.user ? req.user.userId : null;
    const { 
      patient_name, 
      patient_phone,
      emergency_type,
      severity, 
      pickup_latitude, 
      pickup_longitude,
      pickup_address,
      destination_hospital_id,
      notes
    } = req.body;

    if (!patient_name || !patient_phone || !emergency_type || !pickup_latitude || !pickup_longitude) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const result = await pool.query(
      `INSERT INTO emergency_requests 
       (user_id, patient_name, patient_phone, emergency_type, severity, pickup_latitude, pickup_longitude, pickup_address, destination_hospital_id, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
       RETURNING *;`,
      [userId, patient_name, patient_phone, emergency_type, severity || 'medium', pickup_latitude, pickup_longitude, pickup_address, destination_hospital_id, notes]
    );

    const request = result.rows[0];

    // Find nearby available drivers and notify them
    const driversQuery = `
      SELECT dp.user_id, dp.id as driver_id, u.full_name
      FROM driver_profiles dp
      JOIN users u ON dp.user_id = u.id
      WHERE dp.status = 'available'
      ORDER BY (
        6371 * acos(
          cos(radians($1)) * cos(radians(dp.current_latitude)) *
          cos(radians(dp.current_longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(dp.current_latitude))
        )
      ) ASC
      LIMIT 10
    `;

    const driversResult = await pool.query(driversQuery, [pickup_latitude, pickup_longitude]);

    // Create notifications for nearby drivers
    const notificationPromises = driversResult.rows.map(driver =>
      createNotification(
        driver.user_id,
        'New Emergency Request',
        `Emergency: ${emergency_type} - Patient: ${patient_name}`,
        'emergency_request',
        request.id
      )
    );

    await Promise.all(notificationPromises);

    // Emit socket event for real-time notification
    if (req.io) {
      driversResult.rows.forEach(driver => {
        req.io.to(`user_${driver.user_id}`).emit('new-emergency-request', {
          requestId: request.id,
          patientName: patient_name,
          emergencyType: emergency_type,
          severity: severity,
          location: { latitude: pickup_latitude, longitude: pickup_longitude }
        });
      });
    }

    res.status(201).json({
      message: 'Emergency request created successfully!',
      request: result.rows[0],
      notifiedDrivers: driversResult.rows.length
    });
  } catch (err) {
    console.error('Add emergency request error:', err);
    res.status(500).json({ error: 'Failed to add emergency request' });
  }
};

// ✅ Fetch all emergency requests
export const getEmergencyRequests = async (req, res) => {
  try {
    const { status, userId, driverId } = req.query;
    
    let query = `
      SELECT 
        er.*,
        u.full_name as user_name,
        u.phone as user_phone,
        d.id as driver_profile_id,
        du.full_name as driver_name,
        du.phone as driver_phone,
        h.name as hospital_name
      FROM emergency_requests er
      LEFT JOIN users u ON er.user_id = u.id
      LEFT JOIN driver_profiles d ON er.driver_id = d.id
      LEFT JOIN users du ON d.user_id = du.id
      LEFT JOIN hospitals h ON er.destination_hospital_id = h.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND er.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (userId) {
      query += ` AND er.user_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }

    if (driverId) {
      query += ` AND er.driver_id = $${paramCount}`;
      params.push(driverId);
      paramCount++;
    }

    query += ' ORDER BY er.created_at DESC';

    const result = await pool.query(query, params);
    res.status(200).json({ requests: result.rows });
  } catch (err) {
    console.error('Get emergency requests error:', err);
    res.status(500).json({ error: 'Failed to fetch emergency requests' });
  }
};

// Get emergency requests for driver
export const getDriverRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get driver profile
    const driverQuery = await pool.query(
      'SELECT id FROM driver_profiles WHERE user_id = $1',
      [userId]
    );

    if (driverQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    const driverId = driverQuery.rows[0].id;

    const query = `
      SELECT 
        er.*,
        u.full_name as user_name,
        u.phone as user_phone,
        h.name as hospital_name
      FROM emergency_requests er
      LEFT JOIN users u ON er.user_id = u.id
      LEFT JOIN hospitals h ON er.destination_hospital_id = h.id
      WHERE er.driver_id = $1
      ORDER BY er.created_at DESC
    `;

    const result = await pool.query(query, [driverId]);
    res.json({ requests: result.rows });
  } catch (err) {
    console.error('Get driver requests error:', err);
    res.status(500).json({ error: 'Failed to fetch driver requests' });
  }
};

// Get pending emergency requests (for drivers to accept)
export const getPendingRequests = async (req, res) => {
  try {
    const query = `
      SELECT 
        er.*,
        u.full_name as user_name,
        u.phone as user_phone,
        h.name as hospital_name,
        h.address as hospital_address
      FROM emergency_requests er
      LEFT JOIN users u ON er.user_id = u.id
      LEFT JOIN hospitals h ON er.destination_hospital_id = h.id
      WHERE er.status = 'pending'
      ORDER BY 
        CASE er.severity
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        er.created_at ASC
    `;

    const result = await pool.query(query);
    res.json({ requests: result.rows });
  } catch (err) {
    console.error('Get pending requests error:', err);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
};

// Accept emergency request (driver)
export const acceptEmergencyRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Get driver profile
    const driverQuery = await pool.query(
      'SELECT id FROM driver_profiles WHERE user_id = $1 AND status = $2',
      [userId, 'available']
    );

    if (driverQuery.rows.length === 0) {
      return res.status(400).json({ message: 'Driver not available or profile not found' });
    }

    const driverId = driverQuery.rows[0].id;

    // Check if request is still pending
    const requestQuery = await pool.query(
      'SELECT * FROM emergency_requests WHERE id = $1 AND status = $2',
      [id, 'pending']
    );

    if (requestQuery.rows.length === 0) {
      return res.status(400).json({ message: 'Request not available' });
    }

    // Update request status and assign driver
    const updateQuery = `
      UPDATE emergency_requests
      SET driver_id = $1, status = 'accepted'
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [driverId, id]);

    // Update driver status to busy
    await pool.query(
      'UPDATE driver_profiles SET status = $1 WHERE id = $2',
      ['busy', driverId]
    );

    // Notify user
    const request = requestQuery.rows[0];
    if (request.user_id) {
      await createNotification(
        request.user_id,
        'Request Accepted',
        'A driver has accepted your emergency request and is on the way!',
        'request_accepted',
        id
      );

      if (req.io) {
        req.io.to(`user_${request.user_id}`).emit('request-accepted', {
          requestId: id,
          driverId: driverId
        });
      }
    }

    res.json({
      message: 'Request accepted successfully',
      request: result.rows[0]
    });
  } catch (err) {
    console.error('Accept request error:', err);
    res.status(500).json({ error: 'Failed to accept request' });
  }
};

// ✅ Update an emergency request
export const updateEmergencyRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_name, severity, latitude, longitude } = req.body;

    const query = `
      UPDATE emergency_requests
      SET patient_name = $1,
          severity = $2,
          latitude = $3,
          longitude = $4
      WHERE id = $5
      RETURNING *;
    `;

    const values = [patient_name, severity, latitude, longitude, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Emergency request not found' });
    }

    res.status(200).json({
      message: 'Emergency request updated successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update emergency request' });
  }
};

// ✅ Delete an emergency request
export const deleteEmergencyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM emergency_requests WHERE id = $1 RETURNING *;', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Emergency request not found' });
    }

    res.status(200).json({
      message: 'Emergency request deleted successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete emergency request' });
  }
};
