import { Request, Response } from 'express';
import { PrismaClient, NewsCategory } from '@prisma/client';

const prisma = new PrismaClient();

// Get all news with pagination and filtering
export const getAllNews = async (req: Request, res: Response) => {
    try {
        const { 
            page = 1, 
            limit = 9, 
            category, 
            sort = 'newest',
            featured,
            search 
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        // Build where clause
        const where: any = {
            isPublished: true
        };

        if (category && category !== 'all') {
            where.category = category;
        }

        if (featured === 'true') {
            where.isFeatured = true;
        }

        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { excerpt: { contains: search as string, mode: 'insensitive' } },
                { content: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        // Build orderBy clause
        let orderBy: any;
        switch (sort) {
            case 'oldest':
                orderBy = { publishDate: 'asc' };
                break;
            case 'popular':
                orderBy = { views: 'desc' };
                break;
            case 'newest':
            default:
                orderBy = { publishDate: 'desc' };
                break;
        }

        // Get total count
        const totalCount = await prisma.newsPost.count({ where });

        // Get news
        const news = await prisma.newsPost.findMany({
            where,
            orderBy,
            take: limitNum,
            skip: offset
        });

        // Get featured news if on first page
        let featured_news = null;
        if (pageNum === 1 && !category && !search) {
            featured_news = await prisma.newsPost.findFirst({
                where: {
                    isPublished: true,
                    isFeatured: true
                },
                orderBy: { publishDate: 'desc' }
            });
        }

        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
            success: true,
            data: {
                news,
                featured: featured_news,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage: limitNum,
                    hasNext: pageNum < totalPages,
                    hasPrev: pageNum > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news'
        });
    }
};

// Get single news article by slug
export const getNewsBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const news = await prisma.newsPost.findUnique({
            where: { 
                slug,
                isPublished: true 
            }
        });

        if (!news) {
            res.status(404).json({
                success: false,
                error: 'News article not found'
            });
            return;
        }

        // Increment view count
        await prisma.newsPost.update({
            where: { id: news.id },
            data: { views: { increment: 1 } }
        });

        res.json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error('Error fetching news by slug:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news article'
        });
    }
};

// Get single news article by ID
export const getNewsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const news = await prisma.newsPost.findUnique({
            where: { 
                id: parseInt(id),
                isPublished: true 
            }
        });

        if (!news) {
            res.status(404).json({
                success: false,
                error: 'News article not found'
            });
            return;
        }

        // Increment view count
        await prisma.newsPost.update({
            where: { id: news.id },
            data: { views: { increment: 1 } }
        });

        res.json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error('Error fetching news by ID:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news article'
        });
    }
};

// Admin: Get all news (including unpublished)
export const getAllNewsAdmin = async (req: Request, res: Response) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            status = 'all',
            search 
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        // Build where clause
        const where: any = {};

        if (category && category !== 'all') {
            where.category = category;
        }

        if (status !== 'all') {
            where.isPublished = status === 'published';
        }

        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { excerpt: { contains: search as string, mode: 'insensitive' } },
                { content: { contains: search as string, mode: 'insensitive' } },
                { author: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        // Get total count
        const totalCount = await prisma.newsPost.count({ where });

        // Get news
        const news = await prisma.newsPost.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limitNum,
            skip: offset
        });

        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
            success: true,
            data: {
                news,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage: limitNum
                }
            }
        });
    } catch (error) {
        console.error('Error fetching news for admin:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news'
        });
    }
};

// Create news article
export const createNews = async (req: Request, res: Response) => {
    try {
        const {
            title,
            content,
            excerpt,
            imageUrl,
            category,
            author,
            isFeatured = false,
            isPublished = true,
            slug,
            metaTitle,
            metaDesc,
            tags = []
        } = req.body;

        // Generate slug if not provided
        let finalSlug = slug;
        if (!finalSlug) {
            const titleText = typeof title === 'string' ? title : (JSON.parse(title).ru || JSON.parse(title).en || 'news');
            finalSlug = titleText.toLowerCase()
                .replace(/[^a-z0-9а-я\s-]/gi, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            
            // Ensure unique slug
            const existingNews = await prisma.newsPost.findUnique({ where: { slug: finalSlug } });
            if (existingNews) {
                finalSlug = `${finalSlug}-${Date.now()}`;
            }
        }

        const news = await prisma.newsPost.create({
            data: {
                title,
                content,
                excerpt,
                imageUrl,
                category,
                author,
                isFeatured,
                isPublished,
                slug: finalSlug,
                metaTitle,
                metaDesc,
                tags: typeof tags === 'string' ? tags : JSON.stringify(tags)
            }
        });

        res.status(201).json({
            success: true,
            data: news,
            message: 'News article created successfully'
        });
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create news article'
        });
    }
};

// Update news article
export const updateNews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Handle tags
        if (updateData.tags && typeof updateData.tags !== 'string') {
            updateData.tags = JSON.stringify(updateData.tags);
        }

        const news = await prisma.newsPost.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.json({
            success: true,
            data: news,
            message: 'News article updated successfully'
        });
    } catch (error) {
        console.error('Error updating news:', error);
        if ((error as any).code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'News article not found'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Failed to update news article'
        });
    }
};

// Delete news article
export const deleteNews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.newsPost.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'News article deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting news:', error);
        if ((error as any).code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'News article not found'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Failed to delete news article'
        });
    }
};

// Subscribe to newsletter
export const subscribeNewsletter = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                success: false,
                error: 'Email is required'
            });
            return;
        }

        // Check if already subscribed
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email }
        });

        if (existing) {
            if (existing.isActive) {
                res.status(400).json({
                    success: false,
                    error: 'Email already subscribed'
                });
                return;
            } else {
                // Reactivate subscription
                await prisma.newsletterSubscriber.update({
                    where: { email },
                    data: { 
                        isActive: true,
                        unsubscribedAt: null,
                        subscribedAt: new Date()
                    }
                });
            }
        } else {
            // Create new subscription
            await prisma.newsletterSubscriber.create({
                data: { email }
            });
        }

        res.json({
            success: true,
            message: 'Successfully subscribed to newsletter'
        });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to subscribe to newsletter'
        });
    }
};

// Get newsletter subscribers (admin)
export const getNewsletterSubscribers = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 50, status = 'active' } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        const where = status === 'active' ? { isActive: true } : {};

        const totalCount = await prisma.newsletterSubscriber.count({ where });
        
        const subscribers = await prisma.newsletterSubscriber.findMany({
            where,
            orderBy: { subscribedAt: 'desc' },
            take: limitNum,
            skip: offset
        });

        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
            success: true,
            data: {
                subscribers,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage: limitNum
                }
            }
        });
    } catch (error) {
        console.error('Error fetching newsletter subscribers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch newsletter subscribers'
        });
    }
};

// Get news statistics
export const getNewsStats = async (req: Request, res: Response) => {
    try {
        const totalNews = await prisma.newsPost.count();
        const publishedNews = await prisma.newsPost.count({ where: { isPublished: true } });
        const draftNews = await prisma.newsPost.count({ where: { isPublished: false } });
        const featuredNews = await prisma.newsPost.count({ where: { isFeatured: true } });
        const totalSubscribers = await prisma.newsletterSubscriber.count({ where: { isActive: true } });

        // Get category stats
        const categoryStats = await prisma.newsPost.groupBy({
            by: ['category'],
            _count: {
                category: true
            },
            where: { isPublished: true }
        });

        res.json({
            success: true,
            data: {
                totalNews,
                publishedNews,
                draftNews,
                featuredNews,
                totalSubscribers,
                categoryStats: categoryStats.map(stat => ({
                    category: stat.category,
                    count: stat._count.category
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching news stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news statistics'
        });
    }
};