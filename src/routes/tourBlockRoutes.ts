import { Router } from 'express';
import {
  getTourBlocks,
  getTourBlock,
  createTourBlock,
  updateTourBlock,
  deleteTourBlock,
  addTourToBlock,
  removeTourFromBlock
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
router.post('/:blockId/tours/:tourId', authenticateJWT, addTourToBlock);
router.delete('/tours/:tourId', authenticateJWT, removeTourFromBlock);

export default router;