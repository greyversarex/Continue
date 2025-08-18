import { Router } from 'express';
import * as orderController from '../controllers/orderController';

const router = Router();

// Public routes
router.post('/', orderController.createOrder);
router.get('/:orderNumber', orderController.getOrder);

// Admin routes
router.get('/', orderController.getAllOrders);
router.put('/:orderNumber/status', orderController.updateOrderStatus);
router.put('/:orderNumber/cancel', orderController.cancelOrder);

export default router;