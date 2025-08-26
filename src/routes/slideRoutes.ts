import { Router } from 'express';
import {
  getSlides,
  getAllSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
  updateSlideOrder
} from '../controllers/slideController';
// Временно убираем аутентификацию для тестирования

const router = Router();

// Public routes
router.get('/', getSlides); // Get active slides for frontend

// Admin routes (без аутентификации для тестирования)
router.get('/admin', getAllSlides); // Get all slides for admin
router.get('/:id', getSlideById);
router.post('/', createSlide);
router.put('/:id', updateSlide);
router.delete('/:id', deleteSlide);
router.put('/reorder', updateSlideOrder);

export default router;