import { Request, Response } from 'express';
import prisma from '../config/database';
import { ReviewData } from '../types/booking';

export const createReview = async (req: Request, res: Response) => {
  try {
    const { customerId, tourId, rating, text } = req.body;

    // Validation
    if (!customerId || !tourId || !rating || !text) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID, tour ID, rating, and text are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if customer and tour exist
    const [customer, tour] = await Promise.all([
      prisma.customer.findUnique({ where: { id: customerId } }),
      prisma.tour.findUnique({ where: { id: tourId } }),
    ]);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
      });
    }

    // Check if customer already reviewed this tour
    const existingReview = await prisma.review.findFirst({
      where: {
        customerId,
        tourId,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this tour',
      });
    }

    const review = await prisma.review.create({
      data: {
        customerId,
        tourId,
        rating,
        text,
      },
      include: {
        customer: true,
        tour: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will be visible after moderation.',
      data: {
        ...review,
        tour: {
          ...review.tour,
          title: JSON.parse(review.tour.title),
        },
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getReviewsByTour = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        tourId: parseInt(tourId),
        isModerated: true,
        isApproved: true,
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where: any = {};
    
    if (status === 'pending') {
      where.isModerated = false;
    } else if (status === 'approved') {
      where.isModerated = true;
      where.isApproved = true;
    } else if (status === 'rejected') {
      where.isModerated = true;
      where.isApproved = false;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        customer: true,
        tour: {
          select: {
            id: true,
            title: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
    });

    const formattedReviews = reviews.map(review => ({
      ...review,
      tour: {
        ...review.tour,
        title: JSON.parse(review.tour.title),
        category: {
          ...review.tour.category,
          name: JSON.parse(review.tour.category.name),
        },
      },
    }));

    const totalReviews = await prisma.review.count({ where });

    return res.json({
      success: true,
      data: formattedReviews,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: totalReviews,
        totalPages: Math.ceil(totalReviews / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const moderateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isApproved must be a boolean value',
      });
    }

    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        isModerated: true,
        isApproved,
      },
      include: {
        customer: true,
        tour: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: {
        ...review,
        tour: {
          ...review.tour,
          title: JSON.parse(review.tour.title),
        },
      },
    });
  } catch (error) {
    console.error('Error moderating review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to moderate review',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.review.delete({
      where: { id: parseInt(id) },
    });

    return res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getReviewStats = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;

    const stats = await prisma.review.aggregate({
      where: {
        tourId: parseInt(tourId),
        isModerated: true,
        isApproved: true,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        tourId: parseInt(tourId),
        isModerated: true,
        isApproved: true,
      },
      _count: {
        rating: true,
      },
      orderBy: {
        rating: 'asc',
      },
    });

    return res.json({
      success: true,
      data: {
        averageRating: stats._avg.rating ? Number(stats._avg.rating.toFixed(1)) : 0,
        totalReviews: stats._count.rating,
        ratingDistribution: ratingDistribution.map(item => ({
          rating: item.rating,
          count: item._count.rating,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};