import { Router } from 'express';
import { TourController } from '../controllers/tourController';

const router = Router();

// Tour routes
router.get('/tours', TourController.getAllTours);
router.get('/tours/:id', TourController.getTourById);
router.post('/tours', TourController.createTour);

// Category routes
router.get('/categories', TourController.getAllCategories);

export default router;
