const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const packageController = require('../controllers/packageController');
const oilController = require('../controllers/oilController');
const bookingController = require('../controllers/bookingController');
const mechanicController = require('../controllers/mechanicController');
const paymentController = require('../controllers/paymentController');

// Vehicles
router.get('/vehicles', vehicleController.getVehicles);
router.get('/vehicles/:make', vehicleController.getModelsByMake);

// Service Packages
router.get('/packages', packageController.getServicePackages);

// Engine Oils & Consumables
router.get('/oil-options', oilController.getOilOptions);

// Bookings & Workflow
router.post('/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.put('/bookings/:id/status', bookingController.updateBookingStatus);
router.post('/bookings/:id/products', bookingController.addProductUsed);
router.delete('/bookings/:id/products/:barcode', bookingController.removeProductUsed);
router.post('/bookings/:id/rate', bookingController.rateBooking);
router.post('/bookings/:id/verify-otp', bookingController.verifyOtpAndComplete);

// Official Razorpay Integration Endpoints
router.post('/payments/create-order', paymentController.createOrder);
router.post('/payments/verify-signature', paymentController.verifySignature);

// Admin Audit Logs
router.get('/admin/audit-logs', bookingController.getAuditLogs);

// Mechanics & Real Device Geolocation
router.get('/mechanics', mechanicController.getMechanics);
router.get('/mechanics/:id/jobs', mechanicController.getMechanicJobs);
router.put('/mechanics/:id/location', mechanicController.updateMechanicLocation);

module.exports = router;
