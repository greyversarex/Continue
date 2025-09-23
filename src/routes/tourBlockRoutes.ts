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

// Get tours for a specific tour block (теперь поддерживает множественные блоки)
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

    // Ищем туры через новую таблицу связей TourBlockAssignment
    const tourAssignments = await prisma.tourBlockAssignment.findMany({
      where: {
        tourBlockId: blockId
      },
      include: {
        tour: {
          include: {
            category: true,
            tourBlockAssignments: {
              include: {
                tourBlock: true
              }
            }
          }
        }
      },
      orderBy: [
        { isPrimary: 'desc' }, // Сначала основные туры
        { tour: { createdAt: 'desc' } }
      ]
    });

    // Извлекаем туры из связей и фильтруем активные
    const tours = tourAssignments
      .map(assignment => assignment.tour)
      .filter(tour => tour.isActive);

    console.log(`📋 Found ${tours.length} tours for block ${blockId} (via new assignment system)`);

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