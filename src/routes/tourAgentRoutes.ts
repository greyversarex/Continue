import { Router } from 'express';
import {
  loginTourAgent,
  getAllTourAgents,
  getTourAgentById,
  createTourAgent,
  updateTourAgent,
  deleteTourAgent,
  deleteTourAgentDocument,
  upload
} from '../controllers/tourAgentController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Публичные роуты
router.post('/login', loginTourAgent);
router.get('/', getAllTourAgents);
router.get('/:id', getTourAgentById);

// Защищенные роуты (требуют авторизации)
router.post('/create-with-auth', authenticateJWT, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), createTourAgent);

router.put('/profile/:id', authenticateJWT, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), updateTourAgent);

router.delete('/:id', authenticateJWT, deleteTourAgent);
router.delete('/:id/document', authenticateJWT, deleteTourAgentDocument);

export default router;