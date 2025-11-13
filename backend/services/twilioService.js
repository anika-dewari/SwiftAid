import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send SMS using Twilio
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} message - SMS message body
 * @returns {Promise} - Twilio message response
 */
const sendSMS = async (to, message) => {
  try {
    // Ensure phone number has country code
    const formattedPhone = to.startsWith('+') ? to : `+${to}`;
    
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedPhone
    });
    
    console.log(`✅ SMS sent successfully to ${to}. SID: ${response.sid}`);
    return {
      success: true,
      messageSid: response.sid,
      to: response.to,
      status: response.status
    };
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * SMS Templates for different notifications
 */
const smsTemplates = {
  // When user creates emergency request - notify driver
  newEmergencyRequest: (userInfo, emergencyInfo) => {
    return `🚨 EMERGENCY REQUEST

From: ${userInfo.full_name}
Phone: ${userInfo.phone}
Location: ${emergencyInfo.pickup_address}
Emergency: Medical Emergency
Distance: ${emergencyInfo.distance || 'N/A'}

Accept request in your SwiftAid Driver Dashboard.

- SwiftAid Emergency Services`;
  },

  // When driver accepts - notify user
  driverAccepted: (driverInfo, emergencyInfo) => {
    return `✅ DRIVER ASSIGNED

Driver: ${driverInfo.full_name}
Phone: ${driverInfo.phone}
Vehicle: ${driverInfo.vehicle_number}
License: ${driverInfo.license_number}
ETA: ${emergencyInfo.eta || '8-10'} minutes

Your ambulance is on the way!

- SwiftAid`;
  },

  // When driver is en route - notify user
  driverEnRoute: (driverInfo, estimatedTime) => {
    return `🚑 DRIVER ON THE WAY

Your ambulance is arriving soon!
Driver: ${driverInfo.full_name}
Vehicle: ${driverInfo.vehicle_number}
ETA: ${estimatedTime} minutes

Stay calm, help is coming.

- SwiftAid`;
  },

  // When driver arrives - notify user
  driverArrived: (driverInfo) => {
    return `✅ DRIVER HAS ARRIVED

Your ambulance has reached your location.
Driver: ${driverInfo.full_name}
Vehicle: ${driverInfo.vehicle_number}

Please proceed to the vehicle.

- SwiftAid`;
  },

  // When trip is completed - notify both
  tripCompleted: (recipientName, duration) => {
    return `✅ TRIP COMPLETED

Thank you for using SwiftAid!
Trip duration: ${duration} minutes

Rate your experience in the app.

- SwiftAid Emergency Services`;
  },

  // Emergency request cancelled
  requestCancelled: (recipientName, reason) => {
    return `❌ REQUEST CANCELLED

Emergency request has been cancelled.
${reason ? `Reason: ${reason}` : ''}

Stay safe!

- SwiftAid`;
  },

  // Driver reached hospital - notify user/family
  reachedHospital: (hospitalInfo) => {
    return `🏥 REACHED HOSPITAL

Patient has been safely transported to:
${hospitalInfo.name}
${hospitalInfo.address}

Thank you for trusting SwiftAid.

- SwiftAid Emergency Services`;
  }
};

/**
 * Send emergency request notification to driver
 */
const notifyDriverNewRequest = async (driver, user, emergency) => {
  const message = smsTemplates.newEmergencyRequest(
    { full_name: user.full_name, phone: user.phone },
    {
      pickup_address: emergency.pickup_address,
      distance: emergency.distance
    }
  );
  
  return await sendSMS(driver.phone, message);
};

/**
 * Send driver accepted notification to user
 */
const notifyUserDriverAccepted = async (user, driver, emergency) => {
  const message = smsTemplates.driverAccepted(
    {
      full_name: driver.full_name,
      phone: driver.phone,
      vehicle_number: driver.vehicle_number,
      license_number: driver.license_number
    },
    { eta: emergency.eta }
  );
  
  return await sendSMS(user.phone, message);
};

/**
 * Send driver en route notification to user
 */
const notifyUserDriverEnRoute = async (user, driver, eta) => {
  const message = smsTemplates.driverEnRoute(
    {
      full_name: driver.full_name,
      vehicle_number: driver.vehicle_number
    },
    eta
  );
  
  return await sendSMS(user.phone, message);
};

/**
 * Send driver arrived notification to user
 */
const notifyUserDriverArrived = async (user, driver) => {
  const message = smsTemplates.driverArrived({
    full_name: driver.full_name,
    vehicle_number: driver.vehicle_number
  });
  
  return await sendSMS(user.phone, message);
};

/**
 * Send trip completed notification
 */
const notifyTripCompleted = async (phone, name, duration) => {
  const message = smsTemplates.tripCompleted(name, duration);
  return await sendSMS(phone, message);
};

/**
 * Send request cancelled notification
 */
const notifyRequestCancelled = async (phone, name, reason) => {
  const message = smsTemplates.requestCancelled(name, reason);
  return await sendSMS(phone, message);
};

/**
 * Send reached hospital notification
 */
const notifyReachedHospital = async (phone, hospitalInfo) => {
  const message = smsTemplates.reachedHospital(hospitalInfo);
  return await sendSMS(phone, message);
};

export {
  sendSMS,
  smsTemplates,
  notifyDriverNewRequest,
  notifyUserDriverAccepted,
  notifyUserDriverEnRoute,
  notifyUserDriverArrived,
  notifyTripCompleted,
  notifyRequestCancelled,
  notifyReachedHospital
};
