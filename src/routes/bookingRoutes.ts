import express from 'express';
import { bookingController } from '../controllers/bookingController';

const router = express.Router();

// Booking routes
router.post('/start', bookingController.startBooking);
router.put('/:id/update', bookingController.updateBookingStep1);
router.put('/:id/details', bookingController.updateBookingDetails);
router.put('/:id/pay', bookingController.processPayment);
router.get('/:id', bookingController.getBooking);
router.get('/tour/:tourId/hotels', bookingController.getTourHotels);

export default router;