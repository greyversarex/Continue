import { Router } from 'express';
import { priceCalculatorController } from '../controllers/priceCalculatorController';

const router = Router();

// GET /api/price-calculator - Get all price calculator components
router.get('/', priceCalculatorController.getAll);

// GET /api/price-calculator/:key - Get price calculator component by key
router.get('/:key', priceCalculatorController.getByKey);

// POST /api/price-calculator - Create a new price calculator component
router.post('/', priceCalculatorController.create);

// PUT /api/price-calculator/:id - Update a price calculator component
router.put('/:id', priceCalculatorController.update);

// DELETE /api/price-calculator/:id - Delete a price calculator component
router.delete('/:id', priceCalculatorController.delete);

// POST /api/price-calculator/initialize - Initialize default components
router.post('/initialize', priceCalculatorController.initializeDefaults);

export default router;