import { Router } from 'express';
import { AdminController } from '../controllers/adminController';

const router = Router();

// Аутентификация
router.post('/login', AdminController.login);
router.post('/verify-token', AdminController.verifyToken);

// Создание администратора (только для разработки)
router.post('/create-admin', AdminController.createAdmin);

export default router;