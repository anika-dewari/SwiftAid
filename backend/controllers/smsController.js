import pool from '../db.js';
import { sendSMS } from '../services/twilioService.js';

/**
 * Send SMS to driver when assigned to emergency
 * POST /api/send-driver-sms
 */
export const sendDriverSMS = async (req, res) => {
  try {
    const {
      driverId,
      driverName,
      patientName,
      location,
      emergencyType,
      severity
    } = req.body;

    // Get driver's phone number from database
    let driverPhone = null;
    
    // Try to get phone from driver_profiles first
    const driverQuery = await pool.query(
      `SELECT dp.user_id, u.phone, u.full_name
       FROM driver_profiles dp
       JOIN users u ON dp.user_id = u.id
       WHERE dp.id = $1 OR u.full_name = $2
       LIMIT 1`,
      [driverId, driverName]
    );

    if (driverQuery.rows.length > 0) {
      driverPhone = driverQuery.rows[0].phone;
    }

    if (!driverPhone) {
      return res.status(404).json({ 
        error: 'Driver phone number not found',
        message: 'Please update driver phone number in the database'
      });
    }

    // Create SMS message
    const severityEmoji = severity === 'critical' ? '🚨' : severity === 'urgent' ? '⚠️' : '📍';
    const message = `${severityEmoji} EMERGENCY ASSIGNMENT

Patient: ${patientName}
Location: ${location}
Type: ${emergencyType || 'Medical'} Emergency
Severity: ${severity || 'Normal'}

You have been assigned to this emergency. Please check your SwiftAid Driver Dashboard for details.

- SwiftAid Emergency Services`;

    // Send SMS
    const smsResult = await sendSMS(driverPhone, message);

    res.status(200).json({
      success: true,
      message: 'SMS sent successfully to driver',
      smsResult: {
        messageSid: smsResult.messageSid,
        to: smsResult.to,
        status: smsResult.status
      }
    });

  } catch (error) {
    console.error('❌ Send driver SMS error:', error);
    res.status(500).json({ 
      error: 'Failed to send SMS',
      message: error.message 
    });
  }
};

/**
 * Test SMS endpoint
 * POST /api/test-sms
 */
export const testSMS = async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ 
        error: 'Phone number and message are required' 
      });
    }

    const result = await sendSMS(phone, message);

    res.status(200).json({
      success: true,
      message: 'Test SMS sent successfully',
      result
    });

  } catch (error) {
    console.error('❌ Test SMS error:', error);
    res.status(500).json({ 
      error: 'Failed to send test SMS',
      message: error.message 
    });
  }
};
