import { Router } from 'express';
import { 
  TourController, 
  CategoryController, 
  BookingRequestController, 
  ReviewController 
} from '../controllers/tourController';

const router = Router();

// Tour routes
router.get('/tours', TourController.getAllTours);
router.get('/tours/search', TourController.searchTours);
router.get('/tours/:id', TourController.getTourById);
router.post('/tours', TourController.createTour);
router.put('/tours/:id', TourController.updateTour);
router.delete('/tours/:id', TourController.deleteTour);

// Category routes
router.get('/categories', CategoryController.getAllCategories);
router.get('/categories/:id', CategoryController.getCategoryById);
router.post('/categories', CategoryController.createCategory);
router.put('/categories/:id', CategoryController.updateCategory);
router.delete('/categories/:id', CategoryController.deleteCategory);

// Public booking request routes
router.post('/booking-requests', BookingRequestController.createBookingRequest);

// Public review routes
router.post('/reviews', ReviewController.createReview);

// Admin routes
router.get('/booking-requests', BookingRequestController.getAllBookingRequests);
router.get('/reviews', ReviewController.getAllReviews);
router.put('/reviews/:id', ReviewController.updateReview);

export default router;
