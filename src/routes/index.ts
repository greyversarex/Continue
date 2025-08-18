import { Router } from 'express';
import tourRoutes from './tourRoutes';
import categoryRoutes from './categoryRoutes';
import hotelRoutes from './hotelRoutes';
import guideRoutes from './guideRoutes';
import orderRoutes from './orderRoutes';
import reviewRoutes from './reviewRoutes';
import customerRoutes from './customerRoutes';
import paymentRoutes from './paymentRoutes';

const router = Router();

// Mount routes - proper API structure
router.use('/tours', tourRoutes); 
router.use('/categories', categoryRoutes);
router.use('/hotels', hotelRoutes);
router.use('/guides', guideRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/customers', customerRoutes);
router.use('/payments', paymentRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tajik Trails API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0'
  });
});

export default router;
