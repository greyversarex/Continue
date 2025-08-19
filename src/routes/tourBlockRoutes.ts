import { Router } from 'express';
import {
  getTourBlocks,
  getTourBlock,
  createTourBlock,
  updateTourBlock,
  deleteTourBlock,
  addToursToBlock,
  removeToursFromBlock
} from '../controllers/tourBlockController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getTourBlocks);
router.get('/:id', getTourBlock);

// Protected admin routes
router.post('/', authenticateJWT, createTourBlock);
router.put('/:id', authenticateJWT, updateTourBlock);
router.delete('/:id', authenticateJWT, deleteTourBlock);
router.post('/:id/tours', authenticateJWT, addToursToBlock);
router.delete('/:id/tours', authenticateJWT, removeToursFromBlock);

export default router;