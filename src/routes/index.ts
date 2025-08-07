import { Router } from 'express';
import tourRoutes from './tourRoutes';

const router = Router();

// Mount tour routes
router.use('/', tourRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tajik Trails API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;
