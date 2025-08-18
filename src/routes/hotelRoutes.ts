import { Router } from 'express';
import * as hotelController from '../controllers/hotelController';

const router = Router();

// Public routes
router.get('/tours/:tourId/hotels', hotelController.getHotelsByTour);

// Admin routes
router.post('/', hotelController.createHotel);
router.get('/', hotelController.getAllHotels);
router.put('/:id', hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);
router.post('/link', hotelController.linkHotelToTour);

export default router;