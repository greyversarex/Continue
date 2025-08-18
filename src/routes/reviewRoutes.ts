import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';

const router = Router();

// Public routes
router.post('/', reviewController.createReview);
router.get('/tours/:tourId', reviewController.getReviewsByTour);
router.get('/tours/:tourId/stats', reviewController.getReviewStats);

// Admin routes
router.get('/', reviewController.getAllReviews);
router.put('/:id/moderate', reviewController.moderateReview);
router.delete('/:id', reviewController.deleteReview);

export default router;