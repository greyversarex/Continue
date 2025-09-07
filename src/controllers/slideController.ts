import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all slides
export const getSlides = async (req: Request, res: Response) => {
  try {
    const slides = await prisma.slide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    res.json({
      success: true,
      data: slides
    });
  } catch (error) {
    console.error('Error fetching slides:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slides'
    });
  }
};

// Get all slides for admin (including inactive)
export const getAllSlides = async (req: Request, res: Response) => {
  try {
    const slides = await prisma.slide.findMany({
      orderBy: { order: 'asc' }
    });

    res.json({
      success: true,
      data: slides
    });
  } catch (error) {
    console.error('Error fetching all slides:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slides'
    });
  }
};

// Get slide by ID
export const getSlideById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const slide = await prisma.slide.findUnique({
      where: { id: parseInt(id) }
    });

    if (!slide) {
      res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
      return;
    }

    res.json({
      success: true,
      data: slide
    });
  } catch (error) {
    console.error('Error fetching slide:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slide'
    });
  }
};

// Create new slide
export const createSlide = async (req: any, res: Response): Promise<void> => {
  try {
    // Handle file upload
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
      return;
    }

    const imagePath = `/uploads/slides/${req.file.filename}`;
    
    // Parse form data
    const title = req.body.title ? JSON.parse(req.body.title) : {};
    const description = req.body.description ? JSON.parse(req.body.description) : {};
    const buttonText = req.body.buttonText ? JSON.parse(req.body.buttonText) : null;
    const link = req.body.link || '';
    const order = parseInt(req.body.order) || 0;
    const isActive = req.body.isActive === 'true';

    const slide = await prisma.slide.create({
      data: {
        title: JSON.stringify(title),
        description: JSON.stringify(description),
        image: imagePath,
        link,
        buttonText: buttonText ? JSON.stringify(buttonText) : null,
        order,
        isActive
      }
    });

    res.status(201).json({
      success: true,
      data: slide,
      message: 'Slide created successfully'
    });
  } catch (error) {
    console.error('Error creating slide:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create slide'
    });
  }
};

// Update slide
export const updateSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, image, link, buttonText, order, isActive } = req.body;

    const existingSlide = await prisma.slide.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingSlide) {
      res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
      return;
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = JSON.stringify(title);
    if (description !== undefined) updateData.description = JSON.stringify(description);
    if (image !== undefined) updateData.image = image;
    if (link !== undefined) updateData.link = link;
    if (buttonText !== undefined) updateData.buttonText = buttonText ? JSON.stringify(buttonText) : null;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    const slide = await prisma.slide.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      data: slide,
      message: 'Slide updated successfully'
    });
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update slide'
    });
  }
};

// Delete slide
export const deleteSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingSlide = await prisma.slide.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingSlide) {
      res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
      return;
    }

    await prisma.slide.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Slide deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete slide'
    });
  }
};

// Update slide order
export const updateSlideOrder = async (req: Request, res: Response) => {
  try {
    const { slides } = req.body; // Array of {id, order}

    const updatePromises = slides.map((slide: { id: number; order: number }) =>
      prisma.slide.update({
        where: { id: slide.id },
        data: { order: slide.order, updatedAt: new Date() }
      })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Slide order updated successfully'
    });
  } catch (error) {
    console.error('Error updating slide order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update slide order'
    });
  }
};