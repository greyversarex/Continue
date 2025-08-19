import express from 'express';
import {
    getAllNews,
    getNewsBySlug,
    getNewsById,
    getAllNewsAdmin,
    createNews,
    updateNews,
    deleteNews,
    subscribeNewsletter,
    getNewsletterSubscribers,
    getNewsStats
} from '../controllers/newsController';

const router = express.Router();

// Public routes
router.get('/', getAllNews);
router.get('/slug/:slug', getNewsBySlug);
router.get('/:id', getNewsById);
router.post('/newsletter/subscribe', subscribeNewsletter);

// Admin routes (these should be protected with authentication middleware in production)
router.get('/admin/all', getAllNewsAdmin);
router.get('/admin/stats', getNewsStats);
router.post('/admin/create', createNews);
router.put('/admin/:id', updateNews);
router.delete('/admin/:id', deleteNews);
router.get('/admin/newsletter/subscribers', getNewsletterSubscribers);

export default router;