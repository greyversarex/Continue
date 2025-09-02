import express from 'express';
import { authenticateTourGuide } from '../middleware/tourGuideAuth';
import {
  loginTourGuide,
  getGuideTours,
  getTourDetails,
  startTour,
  finishTour,
  collectReviews,
  leaveGuideReview
} from '../controllers/tourGuideController';

const router = express.Router();

// Авторизация
router.post('/login', loginTourGuide);

// Защищённые маршруты для тургидов (требуют авторизации)
router.get('/tours', authenticateTourGuide, getGuideTours);
router.get('/tours/:id', authenticateTourGuide, getTourDetails);
router.post('/tours/:id/start', authenticateTourGuide, startTour);
router.post('/tours/:id/finish', authenticateTourGuide, finishTour);
router.post('/tours/:id/collect-reviews', authenticateTourGuide, collectReviews);
router.post('/tours/:id/guide-review', authenticateTourGuide, leaveGuideReview);

export default router;