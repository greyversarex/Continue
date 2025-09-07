import express from 'express';
import { authenticateDriver } from '../middleware/driverAuth';
import {
  loginDriver,
  getAllDrivers,
  getDriverById,
  createDriverProfile,
  updateDriverProfile,
  deleteDriver,
  getDriverOptions,
  getDriverAssignedEvents,
  startDriverEvent,
  completeDriverEvent,
  upload
} from '../controllers/driverController';

const router = express.Router();

// Авторизация водителя
router.post('/login', loginDriver);

// Создание водителя с аутентификацией (для админ панели) - с поддержкой загрузки файлов
router.post('/create-with-auth', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'documents', maxCount: 10 },
  { name: 'vehiclePhotos', maxCount: 5 }
]), createDriverProfile);

// Маршруты для управления профилем водителя (админ панель) - с поддержкой загрузки файлов
router.put('/profile/:id', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'documents', maxCount: 10 },
  { name: 'vehiclePhotos', maxCount: 5 }
]), updateDriverProfile);

// Получение всех водителей (для админ панели)
router.get('/', getAllDrivers);

// Получение водителя по ID
router.get('/:id', getDriverById);

// Удаление водителя
router.delete('/:id', deleteDriver);

// Получение опций для водителей (типы транспорта, категории прав)
router.get('/options/vehicle-types', getDriverOptions);

// Защищённые маршруты для водителей (требуют авторизации)
// Получение назначенных событий водителя
router.get('/my-events', authenticateDriver, getDriverAssignedEvents);
// Запуск события 
router.post('/events/:eventId/start', authenticateDriver, startDriverEvent);
// Завершение события
router.post('/events/:eventId/complete', authenticateDriver, completeDriverEvent);

export default router;