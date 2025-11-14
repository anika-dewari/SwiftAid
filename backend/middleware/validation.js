// validation.js - Comprehensive validation middleware for SwiftAid
import { body, param, validationResult } from 'express-validator';

// ============================================
// REGEX PATTERNS
// ============================================

const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,10}$/,
  fullName: /^[a-zA-Z\s\.\'\-]{2,255}$/,
  licenseNumber: /^[A-Z]{2}[-]?[0-9]{4,8}$/,
  vehicleNumber: /^[A-Z0-9]{2,4}[-\s]?[A-Z0-9]{3,6}$/,
  vehicleModel: /^[a-zA-Z0-9\s\-\.]{3,100}$/,
  alphanumeric: /^[a-zA-Z0-9\s\-\.]+$/,
  latitude: /^-?([1-8]?[0-9]\.{1}\d+|90\.{1}0+)$/,
  longitude: /^-?((1[0-7][0-9]|[1-9]?[0-9])\.{1}\d+|180\.{1}0+)$/,
};

// ============================================
// ALLOWED ENUM VALUES
// ============================================

const ENUMS = {
  roles: ['user', 'admin', 'driver'],
  driverStatus: ['available', 'busy', 'offline'],
  ambulanceStatus: ['available', 'busy', 'maintenance', 'offline'],
  emergencyTypes: [
    'cardiac-arrest',
    'accident',
    'stroke',
    'respiratory-distress',
    'trauma',
    'burns',
    'poisoning',
    'obstetric',
    'pediatric',
    'other'
  ],
  severityLevels: ['low', 'medium', 'high', 'critical'],
  requestStatus: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
  vehicleTypes: [
    'ambulance',
    'advanced-ambulance',
    'air-ambulance',
    'icu-ambulance',
    'neonatal-ambulance'
  ],
  specialties: [
    'emergency',
    'cardiology',
    'neurology',
    'orthopedics',
    'pediatrics',
    'obstetrics',
    'trauma',
    'burn-unit',
    'icu'
  ],
  equipment: [
    'defibrillator',
    'oxygen-tank',
    'ventilator',
    'stretcher',
    'monitor',
    'ecg-machine',
    'suction-device',
    'spine-board',
    'first-aid-kit',
    'iv-supplies'
  ]
};

// ============================================
// CUSTOM VALIDATORS
// ============================================

const customValidators = {
  // Email validator
  isValidEmail: (value) => {
    if (!value) return false;
    return PATTERNS.email.test(value);
  },

  // Phone validator
  isValidPhone: (value) => {
    if (!value) return true; // Phone is optional in some cases
    return PATTERNS.phone.test(value);
  },

  // License number validator
  isValidLicense: (value) => {
    if (!value) return false;
    return PATTERNS.licenseNumber.test(value.toUpperCase());
  },

  // Vehicle number validator
  isValidVehicleNumber: (value) => {
    if (!value) return false;
    return PATTERNS.vehicleNumber.test(value.toUpperCase());
  },

  // Latitude validator
  isValidLatitude: (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -90 && num <= 90;
  },

  // Longitude validator
  isValidLongitude: (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -180 && num <= 180;
  },

  // Rating validator
  isValidRating: (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 5;
  },

  // Experience years validator
  isValidExperience: (value) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 50;
  },

  // Password strength validator
  isStrongPassword: (value) => {
    if (!value || value.length < 8) return false;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return hasUpper && hasLower && hasNumber && hasSpecial;
  }
};

// ============================================
// VALIDATION CHAINS
// ============================================

// User Registration Validation
export const validateRegistration = [
  body('email')
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .isLength({ min: 5, max: 255 }).withMessage('Email must be 5-255 characters')
    .custom(customValidators.isValidEmail).withMessage('Email format is invalid'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 128 }).withMessage('Password must be 6-128 characters')
    // Uncomment for production:
    // .custom(customValidators.isStrongPassword)
    // .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Full name must be 2-255 characters')
    .matches(PATTERNS.fullName).withMessage('Full name can only contain letters, spaces, dots, hyphens, and apostrophes'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(ENUMS.roles).withMessage(`Role must be one of: ${ENUMS.roles.join(', ')}`),

  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 20 }).withMessage('Phone must be 10-20 characters')
    .custom(customValidators.isValidPhone).withMessage('Invalid phone number format'),

  // Driver-specific validation
  body('driverDetails.license_number')
    .if(body('role').equals('driver'))
    .trim()
    .toUpperCase()
    .notEmpty().withMessage('License number is required for drivers')
    .isLength({ min: 4, max: 50 }).withMessage('License number must be 4-50 characters')
    .custom(customValidators.isValidLicense).withMessage('License number format: XX-12345678'),

  body('driverDetails.vehicle_number')
    .if(body('role').equals('driver'))
    .trim()
    .toUpperCase()
    .notEmpty().withMessage('Vehicle number is required for drivers')
    .isLength({ min: 4, max: 50 }).withMessage('Vehicle number must be 4-50 characters')
    .custom(customValidators.isValidVehicleNumber).withMessage('Vehicle number format: ABC-1234'),

  body('driverDetails.vehicle_type')
    .if(body('role').equals('driver'))
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('Vehicle type is required for drivers')
    .isIn(ENUMS.vehicleTypes).withMessage(`Vehicle type must be one of: ${ENUMS.vehicleTypes.join(', ')}`),

  body('driverDetails.vehicle_model')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Vehicle model must be 3-100 characters')
    .matches(PATTERNS.vehicleModel).withMessage('Vehicle model contains invalid characters'),

  body('driverDetails.experience_years')
    .optional()
    .isInt({ min: 0, max: 50 }).withMessage('Experience must be 0-50 years')
    .custom(customValidators.isValidExperience).withMessage('Invalid experience years'),
];

// User Login Validation
export const validateLogin = [
  body('email')
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// Driver Profile Update Validation
export const validateDriverProfile = [
  body('license_number')
    .optional()
    .trim()
    .toUpperCase()
    .isLength({ min: 4, max: 50 }).withMessage('License number must be 4-50 characters')
    .custom(customValidators.isValidLicense).withMessage('License number format: XX-12345678'),

  body('vehicle_number')
    .optional()
    .trim()
    .toUpperCase()
    .isLength({ min: 4, max: 50 }).withMessage('Vehicle number must be 4-50 characters')
    .custom(customValidators.isValidVehicleNumber).withMessage('Vehicle number format: ABC-1234'),

  body('vehicle_type')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(ENUMS.vehicleTypes).withMessage(`Vehicle type must be one of: ${ENUMS.vehicleTypes.join(', ')}`),

  body('vehicle_model')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Vehicle model must be 3-100 characters')
    .matches(PATTERNS.vehicleModel).withMessage('Vehicle model contains invalid characters'),

  body('experience_years')
    .optional()
    .isInt({ min: 0, max: 50 }).withMessage('Experience must be 0-50 years'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Bio must not exceed 1000 characters'),

  body('current_latitude')
    .optional()
    .custom(customValidators.isValidLatitude).withMessage('Latitude must be between -90 and 90'),

  body('current_longitude')
    .optional()
    .custom(customValidators.isValidLongitude).withMessage('Longitude must be between -180 and 180'),
];

// Driver Status Update Validation
export const validateDriverStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(ENUMS.driverStatus).withMessage(`Status must be one of: ${ENUMS.driverStatus.join(', ')}`),

  body('latitude')
    .optional()
    .custom(customValidators.isValidLatitude).withMessage('Latitude must be between -90 and 90'),

  body('longitude')
    .optional()
    .custom(customValidators.isValidLongitude).withMessage('Longitude must be between -180 and 180'),
];

// Emergency Request Validation
export const validateEmergencyRequest = [
  body('patient_name')
    .trim()
    .notEmpty().withMessage('Patient name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Patient name must be 2-255 characters')
    .matches(PATTERNS.fullName).withMessage('Patient name can only contain letters, spaces, dots, hyphens, and apostrophes'),

  body('patient_phone')
    .trim()
    .notEmpty().withMessage('Patient phone is required')
    .isLength({ min: 10, max: 20 }).withMessage('Phone must be 10-20 characters')
    .custom(customValidators.isValidPhone).withMessage('Invalid phone number format'),

  body('emergency_type')
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('Emergency type is required')
    .isIn(ENUMS.emergencyTypes).withMessage(`Emergency type must be one of: ${ENUMS.emergencyTypes.join(', ')}`),

  body('severity')
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('Severity is required')
    .isIn(ENUMS.severityLevels).withMessage(`Severity must be one of: ${ENUMS.severityLevels.join(', ')}`),

  body('pickup_latitude')
    .notEmpty().withMessage('Pickup latitude is required')
    .custom(customValidators.isValidLatitude).withMessage('Latitude must be between -90 and 90'),

  body('pickup_longitude')
    .notEmpty().withMessage('Pickup longitude is required')
    .custom(customValidators.isValidLongitude).withMessage('Longitude must be between -180 and 180'),

  body('pickup_address')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('Address must be 10-500 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes must not exceed 1000 characters'),
];

// Hospital Validation
export const validateHospital = [
  body('name')
    .trim()
    .notEmpty().withMessage('Hospital name is required')
    .isLength({ min: 3, max: 255 }).withMessage('Hospital name must be 3-255 characters'),

  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 10, max: 500 }).withMessage('Address must be 10-500 characters'),

  body('latitude')
    .notEmpty().withMessage('Latitude is required')
    .custom(customValidators.isValidLatitude).withMessage('Latitude must be between -90 and 90'),

  body('longitude')
    .notEmpty().withMessage('Longitude is required')
    .custom(customValidators.isValidLongitude).withMessage('Longitude must be between -180 and 180'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .isLength({ min: 10, max: 20 }).withMessage('Phone must be 10-20 characters')
    .custom(customValidators.isValidPhone).withMessage('Invalid phone number format'),

  body('available_beds')
    .optional()
    .isInt({ min: 0, max: 10000 }).withMessage('Available beds must be 0-10000'),

  body('emergency_available')
    .optional()
    .isBoolean().withMessage('Emergency available must be true or false'),

  body('specialties')
    .optional()
    .isArray().withMessage('Specialties must be an array')
    .custom((value) => {
      if (value.length > 20) return false;
      return value.every(s => ENUMS.specialties.includes(s));
    }).withMessage(`Specialties must be from: ${ENUMS.specialties.join(', ')} (max 20)`),
];

// Ambulance Validation
export const validateAmbulance = [
  body('vehicle_number')
    .trim()
    .toUpperCase()
    .notEmpty().withMessage('Vehicle number is required')
    .isLength({ min: 4, max: 50 }).withMessage('Vehicle number must be 4-50 characters')
    .custom(customValidators.isValidVehicleNumber).withMessage('Vehicle number format: ABC-1234'),

  body('vehicle_type')
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('Vehicle type is required')
    .isIn(ENUMS.vehicleTypes).withMessage(`Vehicle type must be one of: ${ENUMS.vehicleTypes.join(', ')}`),

  body('status')
    .optional()
    .isIn(ENUMS.ambulanceStatus).withMessage(`Status must be one of: ${ENUMS.ambulanceStatus.join(', ')}`),

  body('equipment')
    .optional()
    .isArray().withMessage('Equipment must be an array')
    .custom((value) => {
      if (value.length > 30) return false;
      return value.every(e => ENUMS.equipment.includes(e));
    }).withMessage(`Equipment must be from: ${ENUMS.equipment.join(', ')} (max 30)`),

  body('current_latitude')
    .optional()
    .custom(customValidators.isValidLatitude).withMessage('Latitude must be between -90 and 90'),

  body('current_longitude')
    .optional()
    .custom(customValidators.isValidLongitude).withMessage('Longitude must be between -180 and 180'),
];

// ============================================
// VALIDATION RESULT HANDLER
// ============================================

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: formattedErrors
      }
    });
  }
  
  next();
};

// ============================================
// INPUT SANITIZATION
// ============================================

export const sanitizeInput = (req, res, next) => {
  // Trim all string values
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = sanitize(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  
  next();
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  validateRegistration,
  validateLogin,
  validateDriverProfile,
  validateDriverStatus,
  validateEmergencyRequest,
  validateHospital,
  validateAmbulance,
  handleValidationErrors,
  sanitizeInput,
  PATTERNS,
  ENUMS
};
