import express from 'express';
import {
  addAmbulance,
  getAmbulances,
  updateAmbulance,
  deleteAmbulance,
} from '../controllers/ambulanceController.js';
import {
  addDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
} from '../controllers/driverController.js';
import {
  addHospital,
  getHospitals,
  updateHospital,
  deleteHospital,
} from '../controllers/hospitalController.js';
import {
  addEmergencyRequest,
  getEmergencyRequests,
  updateEmergencyRequest,
  deleteEmergencyRequest,
} from '../controllers/emergencyRequestController.js';
import { createFullDispatch } from '../controllers/dispatchController.js';

const router = express.Router();

// 🚑 Ambulances
router.post('/ambulances', addAmbulance);
router.get('/ambulances', getAmbulances);
router.put('/ambulances/:id', updateAmbulance);
router.delete('/ambulances/:id', deleteAmbulance);

// 👨‍✈️ Drivers
router.post('/drivers', addDriver);
router.get('/drivers', getDrivers);
router.put('/drivers/:id', updateDriver);
router.delete('/drivers/:id', deleteDriver);

// 🏥 Hospitals
router.post('/hospitals', addHospital);
router.get('/hospitals', getHospitals);
router.put('/hospitals/:id', updateHospital);
router.delete('/hospitals/:id', deleteHospital);

// 🚨 Emergency Requests
router.post('/emergency-requests', addEmergencyRequest);
router.get('/emergency-requests', getEmergencyRequests);
router.put('/emergency-requests/:id', updateEmergencyRequest);
router.delete('/emergency-requests/:id', deleteEmergencyRequest);

// 🚚 Full Dispatch
router.post('/dispatch/full', createFullDispatch);

export default router;
