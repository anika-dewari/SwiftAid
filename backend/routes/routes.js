import express from 'express';
import { addAmbulance, getAmbulances } from '../controllers/ambulanceController.js';
import { addDriver, getDrivers } from '../controllers/driverController.js';
import { addHospital, getHospitals } from '../controllers/hospitalController.js';
import { addEmergencyRequest, getEmergencyRequests } from '../controllers/emergencyRequestController.js';
import { createFullDispatch } from '../controllers/dispatchController.js';

const router = express.Router();

// Ambulances
router.post('/ambulances', addAmbulance);
router.get('/ambulances', getAmbulances);

// Drivers
router.post('/drivers', addDriver);
router.get('/drivers', getDrivers);

// Hospitals
router.post('/hospitals', addHospital);
router.get('/hospitals', getHospitals);

// Emergency Requests
router.post('/emergency-requests', addEmergencyRequest);
router.get('/emergency-requests', getEmergencyRequests);

// Full Dispatch
router.post('/dispatch/full', createFullDispatch);

export default router;
