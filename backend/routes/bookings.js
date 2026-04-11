const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes are protected
router.use(protect);

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);
router.get('/coolie-tasks', bookingController.getCoolieBookings);
router.get('/coolie-stats', bookingController.getCoolieStats);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.post('/:id/rate', bookingController.rateBooking);

module.exports = router;
