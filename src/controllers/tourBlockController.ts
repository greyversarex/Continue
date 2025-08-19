import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all tour blocks
export const getTourBlocks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tourBlocks = await prisma.tourBlock.findMany({
      include: {
        tours: {
          where: { isActive: true },
          include: {
            category: true,
            reviews: true,
            _count: {
              select: { reviews: true }
            }
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return res.json({
      success: true,
      data: tourBlocks
    });
  } catch (error) {
    console.error('Error fetching tour blocks:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching tour blocks'
    });
  }
};

// Get single tour block
export const getTourBlock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const tourBlock = await prisma.tourBlock.findUnique({
      where: { id: parseInt(id) },
      include: {
        tours: {
          include: {
            category: true,
            reviews: true,
            _count: {
              select: { reviews: true }
            }
          }
        }
      }
    });

    if (!tourBlock) {
      return res.status(404).json({
        success: false,
        message: 'Tour block not found'
      });
    }

    return res.json({
      success: true,
      data: tourBlock
    });
  } catch (error) {
    console.error('Error fetching tour block:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching tour block'
    });
  }
};

// Create tour block
export const createTourBlock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, slug, isActive, sortOrder } = req.body;

    // Check if slug already exists
    const existingBlock = await prisma.tourBlock.findUnique({
      where: { slug }
    });

    if (existingBlock) {
      return res.status(400).json({
        success: false,
        message: 'Tour block with this slug already exists'
      });
    }

    const tourBlock = await prisma.tourBlock.create({
      data: {
        title,
        description,
        slug,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0
      }
    });

    return res.json({
      success: true,
      data: tourBlock
    });
  } catch (error) {
    console.error('Error creating tour block:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating tour block'
    });
  }
};

// Update tour block
export const updateTourBlock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { title, description, slug, isActive, sortOrder } = req.body;

    // Check if new slug conflicts with existing blocks (excluding current one)
    if (slug) {
      const existingBlock = await prisma.tourBlock.findFirst({
        where: {
          slug,
          id: { not: parseInt(id) }
        }
      });

      if (existingBlock) {
        return res.status(400).json({
          success: false,
          message: 'Tour block with this slug already exists'
        });
      }
    }

    const tourBlock = await prisma.tourBlock.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        slug,
        isActive,
        sortOrder
      }
    });

    return res.json({
      success: true,
      data: tourBlock
    });
  } catch (error) {
    console.error('Error updating tour block:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating tour block'
    });
  }
};

// Delete tour block
export const deleteTourBlock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    // Check if tour block has tours
    const tourBlock = await prisma.tourBlock.findUnique({
      where: { id: parseInt(id) },
      include: {
        tours: true
      }
    });

    if (!tourBlock) {
      return res.status(404).json({
        success: false,
        message: 'Tour block not found'
      });
    }

    if (tourBlock.tours.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tour block that contains tours. Please reassign tours first.'
      });
    }

    await prisma.tourBlock.delete({
      where: { id: parseInt(id) }
    });

    return res.json({
      success: true,
      message: 'Tour block deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tour block:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting tour block'
    });
  }
};

// Add tours to block
export const addToursToBlock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { tourIds } = req.body;

    if (!Array.isArray(tourIds) || tourIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tour IDs array is required'
      });
    }

    // Update tours to belong to this block
    await prisma.tour.updateMany({
      where: {
        id: { in: tourIds }
      },
      data: {
        tourBlockId: parseInt(id)
      }
    });

    return res.json({
      success: true,
      message: 'Tours added to block successfully'
    });
  } catch (error) {
    console.error('Error adding tours to block:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding tours to block'
    });
  }
};

// Remove tours from block
export const removeToursFromBlock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { tourIds } = req.body;

    if (!Array.isArray(tourIds) || tourIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tour IDs array is required'
      });
    }

    // Remove tours from this block
    await prisma.tour.updateMany({
      where: {
        id: { in: tourIds },
        tourBlockId: parseInt(id)
      },
      data: {
        tourBlockId: null
      }
    });

    return res.json({
      success: true,
      message: 'Tours removed from block successfully'
    });
  } catch (error) {
    console.error('Error removing tours from block:', error);
    return res.status(500).json({
      success: false,
      message: 'Error removing tours from block'
    });
  }
};