import { Router } from 'express';
import {
  getAllTourAgents,
  getActiveTourAgents,
  getTourAgentById,
  createTourAgent,
  updateTourAgent,
  deleteTourAgent,
  toggleTourAgentStatus,
  uploadTourAgentPhoto
} from '../controllers/tourAgentController';

const router = Router();

// Публичные маршруты
router.get('/public', getActiveTourAgents);                    // GET /api/tour-agents/public - активные турагенты
router.get('/public/:id', getTourAgentById);                   // GET /api/tour-agents/public/:id - турагент по ID

// Администраторские маршруты (требуют авторизацию)
router.get('/', getAllTourAgents);                             // GET /api/tour-agents - все турагенты
router.get('/:id', getTourAgentById);                          // GET /api/tour-agents/:id - турагент по ID
router.post('/', uploadTourAgentPhoto, createTourAgent);       // POST /api/tour-agents - создать турагента
router.put('/:id', uploadTourAgentPhoto, updateTourAgent);     // PUT /api/tour-agents/:id - обновить турагента
router.delete('/:id', deleteTourAgent);                        // DELETE /api/tour-agents/:id - удалить турагента
router.patch('/:id/toggle-status', toggleTourAgentStatus);     // PATCH /api/tour-agents/:id/toggle-status - переключить статус

export default router;