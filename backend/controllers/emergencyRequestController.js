import pool from '../db.js';
import { createNotification } from './notificationController.js';
import { 
  sendSMS,
  notifyDriverNewRequest,
  notifyUserDriverAccepted,
  notifyUserDriverEnRoute,
  notifyUserDriverArrived,
  notifyTripCompleted
} from '../services/twilioService.js';

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
      notes,
      send_sms // SMS flag from frontend
    } = req.body;

    console.log('📝 Emergency request received:', {
      patient_name,
      patient_phone,
      emergency_type,
      severity,
      pickup_latitude,
      pickup_longitude,
      userId,
      send_sms
    });

    if (!patient_name || !patient_phone || !emergency_type || !pickup_latitude || !pickup_longitude) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Ensure severity is valid for database schema
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    const finalSeverity = validSeverities.includes(severity) ? severity : 'medium';

    console.log(`📊 Using severity: ${finalSeverity}`);

    const result = await pool.query(
      `INSERT INTO emergency_requests 
       (user_id, patient_name, patient_phone, emergency_type, severity, pickup_latitude, pickup_longitude, pickup_address, destination_hospital_id, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
       RETURNING *;`,
      [userId, patient_name, patient_phone, emergency_type, finalSeverity, pickup_latitude, pickup_longitude, pickup_address, destination_hospital_id, notes]
    );

    const request = result.rows[0];
    console.log('✅ Emergency request created:', request.id);

    // Find nearby available drivers and notify them
    const driversQuery = `
      SELECT dp.user_id, dp.id as driver_id, dp.license_number, dp.vehicle_number,
             u.full_name, u.phone
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

    let driversResult = { rows: [] };
    try {
      driversResult = await pool.query(driversQuery, [pickup_latitude, pickup_longitude]);
      console.log(`📍 Found ${driversResult.rows.length} nearby drivers`);
    } catch (driverError) {
      console.error('⚠️ Error fetching nearby drivers (continuing):', driverError.message);
    }

    // Create notifications for nearby drivers (NO SMS - only in-app)
    if (driversResult.rows.length > 0) {
      const notificationPromises = driversResult.rows.map(driver =>
        createNotification(
          driver.user_id,
          'New Emergency Request',
          `Emergency: ${emergency_type} - Patient: ${patient_name}`,
          'emergency_request',
          request.id
        ).catch(err => console.error(`⚠️ Notification error for driver ${driver.user_id}:`, err.message))
      );

      await Promise.all(notificationPromises);
    }

    // Send SMS to drivers if enabled
    let smsResults = { sent: 0, failed: 0 };
    if (send_sms === true || send_sms === 'true') {
      console.log(`📱 SMS enabled - sending to ${driversResult.rows.length} nearby drivers...`);
      
      for (const driver of driversResult.rows) {
        if (driver.phone) {
          try {
            // Extract medical info from notes if available
            const medicalInfo = [];
            if (notes) {
              const lines = notes.split('\n');
              lines.forEach(line => {
                if (line.includes('Allergies:') && !line.includes('None')) {
                  medicalInfo.push(line.trim());
                }
                if (line.includes('Medications:') && !line.includes('None')) {
                  medicalInfo.push(line.trim());
                }
              });
            }

            // Build custom SMS message based on provided data
            let smsMessage = `🚨 URGENT: NEW EMERGENCY REQUEST\n\n`;
            smsMessage += `👤 Patient: ${patient_name}\n`;
            smsMessage += `📞 Contact: ${patient_phone}\n`;
            smsMessage += `📍 Location: ${pickup_address || `GPS: ${pickup_latitude}, ${pickup_longitude}`}\n`;
            smsMessage += `🚑 Type: ${emergency_type}\n`;
            smsMessage += `⚠️ Severity: ${(finalSeverity || 'medium').toUpperCase()}\n`;
            
            // Add medical info if available
            if (medicalInfo.length > 0) {
              smsMessage += `\n💊 Medical Info:\n${medicalInfo.join('\n')}\n`;
            }
            
            // Add description if provided
            if (notes && !notes.includes('Allergies:') && !notes.includes('Medications:')) {
              const description = notes.substring(0, 100); // Limit length
              smsMessage += `\n📝 Details: ${description}${notes.length > 100 ? '...' : ''}\n`;
            }
            
            smsMessage += `\n✅ Please open SwiftAid Driver App to ACCEPT this emergency\n`;
            smsMessage += `\n- SwiftAid Emergency Response`;
            
            await sendSMS(driver.phone, smsMessage);
            smsResults.sent++;
            console.log(`✅ SMS sent successfully to driver: ${driver.full_name} (${driver.phone})`);
          } catch (smsError) {
            smsResults.failed++;
            console.error(`❌ SMS failed for driver ${driver.full_name}:`, smsError.message);
          }
        } else {
          console.log(`⚠️ No phone number for driver: ${driver.full_name}`);
        }
      }
      
      console.log(`📊 SMS Results: ${smsResults.sent} sent, ${smsResults.failed} failed`);
    } else {
      console.log('📱 SMS disabled - skipping SMS notifications');
    }

    // Emit socket event for real-time notification
    if (req.io) {
      driversResult.rows.forEach(driver => {
        req.io.to(`user_${driver.user_id}`).emit('new-emergency-request', {
          requestId: request.id,
          patientName: patient_name,
          emergencyType: emergency_type,
          severity: finalSeverity,
          location: { latitude: pickup_latitude, longitude: pickup_longitude }
        });
      });
    }

    res.status(201).json({
      message: 'Emergency request created successfully!',
      request: result.rows[0],
      notifiedDrivers: driversResult.rows.length,
      smsResults: send_sms ? smsResults : { sent: 0, failed: 0, reason: 'SMS disabled' }
    });
  } catch (err) {
    console.error('❌ Add emergency request error:', err);
    console.error('❌ Error stack:', err.stack);
    console.error('❌ Error message:', err.message);
    res.status(500).json({ 
      error: 'Failed to add emergency request',
      details: err.message 
    });
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

    // Get driver details with phone
    const driverDetails = await pool.query(
      `SELECT dp.*, u.full_name, u.phone 
       FROM driver_profiles dp 
       JOIN users u ON dp.user_id = u.id 
       WHERE dp.id = $1`,
      [driverId]
    );

    const driver = driverDetails.rows[0];

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
      // Send in-app notification
      await createNotification(
        request.user_id,
        'Request Accepted',
        'A driver has accepted your emergency request and is on the way!',
        'request_accepted',
        id
      );

      // Get user details for SMS
      const userDetails = await pool.query(
        'SELECT full_name, phone FROM users WHERE id = $1',
        [request.user_id]
      );

      const user = userDetails.rows[0];

      // Send SMS notification to user if they have phone number
      if (user && user.phone) {
        try {
          await notifyUserDriverAccepted(user, driver, { eta: '8-10' });
          console.log(`✅ SMS sent to user: ${user.full_name}`);
        } catch (smsError) {
          console.error(`❌ SMS failed for user ${user.full_name}:`, smsError.message);
        }
      }

      if (req.io) {
        // Emit accepted event with driver details and location so the requester can see driver on map
        req.io.to(`user_${request.user_id}`).emit('request-accepted', {
          requestId: id,
          driverId: driverId,
          driverName: driver.full_name,
          driverPhone: driver.phone,
          vehicleNumber: driver.vehicle_number,
          vehicleModel: driver.vehicle_model,
          driverLocation: {
            latitude: driver.current_latitude || null,
            longitude: driver.current_longitude || null
          },
          eta: '8-10'
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

// Update request status with SMS notifications (driver updates: in_progress, completed)
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, eta } = req.body; // status: 'in_progress', 'completed'
    const userId = req.user.userId;

    // Validate status - must match database schema
    const validStatuses = ['in_progress', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: in_progress, completed, cancelled' 
      });
    }

    // Get request details
    const requestQuery = await pool.query(
      `SELECT er.*, u.full_name as user_name, u.phone as user_phone
       FROM emergency_requests er
       LEFT JOIN users u ON er.user_id = u.id
       WHERE er.id = $1`,
      [id]
    );

    if (requestQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Emergency request not found' });
    }

    const request = requestQuery.rows[0];

    // Get driver details
    const driverQuery = await pool.query(
      `SELECT dp.*, u.full_name, u.phone
       FROM driver_profiles dp
       JOIN users u ON dp.user_id = u.id
       WHERE dp.user_id = $1`,
      [userId]
    );

    if (driverQuery.rows.length === 0) {
      return res.status(403).json({ error: 'Driver profile not found' });
    }

    const driver = driverQuery.rows[0];

    // Verify driver is assigned to this request
    if (request.driver_id !== driver.id) {
      return res.status(403).json({ error: 'You are not assigned to this request' });
    }

    // Update status
    const updateQuery = await pool.query(
      'UPDATE emergency_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // If completed, update driver status back to available
    if (status === 'completed') {
      await pool.query(
        'UPDATE driver_profiles SET status = $1 WHERE id = $2',
        ['available', driver.id]
      );
    }

    // Send SMS notifications based on status
    const user = { full_name: request.user_name, phone: request.user_phone };

    if (user.phone) {
      try {
        switch (status) {
          case 'in_progress':
            await notifyUserDriverEnRoute(user, driver, eta || '8-10');
            console.log(`✅ SMS sent to user: Driver en route`);
            break;

          case 'completed':
            const duration = calculateDuration(request.created_at);
            await notifyTripCompleted(user.phone, user.full_name, duration);
            
            // Also notify driver
            if (driver.phone) {
              await notifyTripCompleted(driver.phone, driver.full_name, duration);
            }
            console.log(`✅ SMS sent to both user and driver: Trip completed`);
            break;

          default:
            break;
        }
      } catch (smsError) {
        console.error(`❌ SMS failed:`, smsError.message);
        // Don't fail the request if SMS fails
      }
    }

    // Send in-app notification
    if (request.user_id) {
      const notificationMessages = {
        in_progress: 'Your ambulance is on the way!',
        completed: 'Trip completed. Thank you for using SwiftAid!',
        cancelled: 'Your request has been cancelled.'
      };

      await createNotification(
        request.user_id,
        'Request Status Update',
        notificationMessages[status],
        'status_update',
        id
      );

      if (req.io) {
        req.io.to(`user_${request.user_id}`).emit('request-status-updated', {
          requestId: id,
          status: status
        });
      }
    }

    res.json({
      message: `Request status updated to ${status}`,
      request: updateQuery.rows[0]
    });
  } catch (err) {
    console.error('Update request status error:', err);
    res.status(500).json({ error: 'Failed to update request status' });
  }
};

// Assign driver to emergency request (User selects driver) - Sends SMS
export const assignDriverToRequest = async (req, res) => {
  try {
    const { requestId, driverId } = req.body;
    const userId = req.user.userId;

    if (!requestId || !driverId) {
      return res.status(400).json({ error: 'Request ID and Driver ID are required' });
    }

    // Get emergency request details
    const requestQuery = await pool.query(
      `SELECT er.*, u.full_name as user_name, u.phone as user_phone
       FROM emergency_requests er
       LEFT JOIN users u ON er.user_id = u.id
       WHERE er.id = $1 AND er.status = 'pending'`,
      [requestId]
    );

    if (requestQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Emergency request not found or already assigned' });
    }

    const request = requestQuery.rows[0];

    // Verify the request belongs to this user
    if (request.user_id !== userId) {
      return res.status(403).json({ error: 'You can only assign drivers to your own requests' });
    }

    // Get driver details
    const driverQuery = await pool.query(
      `SELECT dp.*, u.full_name, u.phone, u.email
       FROM driver_profiles dp
       JOIN users u ON dp.user_id = u.id
       WHERE dp.id = $1 AND dp.status = 'available'`,
      [driverId]
    );

    if (driverQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found or not available' });
    }

    const driver = driverQuery.rows[0];

    // Assign driver to request
    await pool.query(
      `UPDATE emergency_requests 
       SET driver_id = $1, status = 'accepted' 
       WHERE id = $2`,
      [driverId, requestId]
    );

    // Update driver status to busy
    await pool.query(
      `UPDATE driver_profiles 
       SET status = 'busy' 
       WHERE id = $1`,
      [driverId]
    );

    // Send SMS to driver
    if (driver.phone) {
      try {
        const userData = {
          full_name: request.user_name || request.patient_name,
          phone: request.user_phone || request.patient_phone
        };

        await notifyDriverNewRequest(
          driver,
          userData,
          {
            pickup_address: request.pickup_address || `${request.pickup_latitude}, ${request.pickup_longitude}`,
            distance: null
          }
        );

        console.log(`✅ SMS sent to driver: ${driver.full_name} (${driver.phone})`);
        console.log(`📱 Driver will receive notification for emergency request #${requestId}`);
      } catch (smsError) {
        console.error(`❌ SMS failed for driver ${driver.full_name}:`, smsError.message);
        // Continue even if SMS fails
      }
    } else {
      console.log(`⚠️ Driver ${driver.full_name} has no phone number. SMS not sent.`);
    }

    // Send in-app notification to driver
    await createNotification(
      driver.user_id,
      'Emergency Request Assigned',
      `You have been assigned to emergency: ${request.emergency_type} - Patient: ${request.patient_name}`,
      'emergency_assigned',
      requestId
    );

    // Send real-time notification via socket
    if (req.io) {
      req.io.to(`user_${driver.user_id}`).emit('emergency-assigned', {
        requestId: requestId,
        emergencyType: request.emergency_type,
        patientName: request.patient_name,
        location: request.pickup_address
      });
    }

    res.status(200).json({
      message: 'Driver assigned successfully! SMS notification sent.',
      request: {
        id: requestId,
        driver: {
          id: driver.id,
          name: driver.full_name,
          phone: driver.phone,
          vehicle: driver.vehicle_number,
          license: driver.license_number
        },
        smsSent: !!driver.phone
      }
    });

  } catch (err) {
    console.error('Assign driver error:', err);
    res.status(500).json({ error: 'Failed to assign driver' });
  }
};

// Helper function to calculate trip duration
function calculateDuration(createdAt) {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now - created;
  const diffMins = Math.round(diffMs / 60000);
  return diffMins;
}
