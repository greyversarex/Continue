import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
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

const prisma = new PrismaClient();

const router = Router();

// Public routes
router.get('/', getTourBlocks);

// Get tours for a specific tour block (должен быть выше /:id)
router.get('/:id/tours', async (req, res) => {
  try {
    const blockId = parseInt(req.params.id);
    
    if (!blockId) {
      res.status(400).json({
        success: false,
        message: 'ID блока тура обязателен'
      });
      return;
    }

    const tours = await prisma.tour.findMany({
      where: {
        tourBlockId: blockId,
        isActive: true
      },
      include: {
        category: true,
        tourBlock: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Found ${tours.length} tours for block ${blockId}`);

    res.json({
      success: true,
      data: tours
    });

  } catch (error) {
    console.error('❌ Error getting tours for block:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

router.get('/:id', getTourBlock);

// Protected admin routes
router.post('/', authenticateJWT, createTourBlock);
router.put('/:id', authenticateJWT, updateTourBlock);
router.delete('/:id', authenticateJWT, deleteTourBlock);
router.post('/:blockId/tours/:tourId', authenticateJWT, addTourToBlock);
router.delete('/tours/:tourId', authenticateJWT, removeTourFromBlock);

export default router;