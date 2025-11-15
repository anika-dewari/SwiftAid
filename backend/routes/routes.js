import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, authorizeRole, optionalAuth } from '../middleware/auth.js';

// Auth Controller
import {
  register,
  login,
  getProfile,
  updateProfile,
  verifyToken,
} from '../controllers/authController.js';

// Ambulance Controller
import {
  addAmbulance,
  getAmbulances,
  updateAmbulance,
  deleteAmbulance,
} from '../controllers/ambulanceController.js';

// Driver Controller
import {
  getDriverProfile,
  updateDriverProfile,
  updateDriverStatus,
  getAllDrivers,
  getAvailableDrivers,
  getDriverById,
  getDriverStats,
} from '../controllers/driverController.js';

// Hospital Controller
import {
  addHospital,
  getHospitals,
  updateHospital,
  deleteHospital,
} from '../controllers/hospitalController.js';

// Emergency Request Controller
import {
  addEmergencyRequest,
  getEmergencyRequests,
  updateEmergencyRequest,
  deleteEmergencyRequest,
  getDriverRequests,
  getPendingRequests,
  acceptEmergencyRequest,
  updateRequestStatus,
  cancelEmergencyRequest,
  assignDriverToRequest,
} from '../controllers/emergencyRequestController.js';

// Notification Controller
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from '../controllers/notificationController.js';

// SMS Controller
import {
  sendDriverSMS,
  testSMS,
} from '../controllers/smsController.js';

// Dispatch Controller
import { createFullDispatch } from '../controllers/dispatchController.js';

const router = express.Router();

// =========================================
// � AUTHENTICATION ROUTES (Public)
// =========================================
router.post(
  '/auth/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['user', 'admin', 'driver']).withMessage('Invalid role'),
    body('full_name').notEmpty().withMessage('Full name required'),
  ],
  register
);

router.post(
  '/auth/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  login
);

router.get('/auth/verify', authenticateToken, verifyToken);
router.get('/auth/profile', authenticateToken, getProfile);
router.put('/auth/profile', authenticateToken, updateProfile);

// =========================================
// 👨‍✈️ DRIVER ROUTES
// =========================================

// Driver-only routes (authenticated driver)
router.get('/drivers/profile', authenticateToken, authorizeRole('driver'), getDriverProfile);
router.put('/drivers/profile', authenticateToken, authorizeRole('driver'), updateDriverProfile);
router.put('/drivers/status', authenticateToken, authorizeRole('driver'), updateDriverStatus);
router.get('/drivers/stats', authenticateToken, authorizeRole('driver'), getDriverStats);
router.get('/drivers/requests', authenticateToken, authorizeRole('driver'), getDriverRequests);

// Public/User routes for viewing drivers
router.get('/drivers', optionalAuth, getAllDrivers);
router.get('/drivers/available', optionalAuth, getAvailableDrivers);
router.get('/drivers/:id', optionalAuth, getDriverById);

// =========================================
// 🚨 EMERGENCY REQUEST ROUTES
// =========================================

// Create emergency request (authenticated users or public with phone)
router.post('/emergency-requests', optionalAuth, addEmergencyRequest);

// Get all requests (with filters)
router.get('/emergency-requests', authenticateToken, getEmergencyRequests);

// Get pending requests (for drivers)
router.get('/emergency-requests/pending', authenticateToken, authorizeRole('driver', 'admin'), getPendingRequests);

// Accept request (driver only)
router.post('/emergency-requests/:id/accept', authenticateToken, authorizeRole('driver'), acceptEmergencyRequest);

// Update request status (driver can update status: en_route, arrived, completed)
router.patch('/emergency-requests/:id/status', authenticateToken, authorizeRole('driver'), updateRequestStatus);

// Cancel request (request owner or assigned driver)
router.post('/emergency-requests/:id/cancel', authenticateToken, cancelEmergencyRequest);

// Update/Delete (admin only)
router.put('/emergency-requests/:id', authenticateToken, authorizeRole('admin'), updateEmergencyRequest);
router.delete('/emergency-requests/:id', authenticateToken, authorizeRole('admin'), deleteEmergencyRequest);

// =========================================
// � NOTIFICATION ROUTES
// =========================================
router.get('/notifications', authenticateToken, getUserNotifications);
router.get('/notifications/unread-count', authenticateToken, getUnreadCount);
router.put('/notifications/:id/read', authenticateToken, markAsRead);
router.put('/notifications/read-all', authenticateToken, markAllAsRead);
router.delete('/notifications/:id', authenticateToken, deleteNotification);

// =========================================
// 🚑 AMBULANCE ROUTES
// =========================================
router.post('/ambulances', authenticateToken, authorizeRole('admin'), addAmbulance);
router.get('/ambulances', optionalAuth, getAmbulances);
router.put('/ambulances/:id', authenticateToken, authorizeRole('admin'), updateAmbulance);
router.delete('/ambulances/:id', authenticateToken, authorizeRole('admin'), deleteAmbulance);

// =========================================
// 🏥 HOSPITAL ROUTES
// =========================================
router.post('/hospitals', authenticateToken, authorizeRole('admin'), addHospital);
router.get('/hospitals', optionalAuth, getHospitals);
router.put('/hospitals/:id', authenticateToken, authorizeRole('admin'), updateHospital);
router.delete('/hospitals/:id', authenticateToken, authorizeRole('admin'), deleteHospital);

// =========================================
// 🚚 DISPATCH ROUTES
// =========================================
router.post('/dispatch/full', authenticateToken, authorizeRole('admin', 'user'), createFullDispatch);

// =========================================
// 📱 SMS ROUTES
// =========================================
router.post('/send-driver-sms', authenticateToken, sendDriverSMS);
router.post('/test-sms', authenticateToken, authorizeRole('admin'), testSMS);

// =========================================
// 🏠 HEALTH CHECK
// =========================================
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SwiftAid API is running' });
});

export default router;
