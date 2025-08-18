import { Request, Response } from 'express';
import prisma from '../config/database';
import { GuideData } from '../types/booking';

export const createGuide = async (req: Request, res: Response) => {
  try {
    const guideData: GuideData = req.body;
    
    const guide = await prisma.guide.create({
      data: {
        name: JSON.stringify(guideData.name),
        description: guideData.description ? JSON.stringify(guideData.description) : null,
        photo: guideData.photo,
        languages: JSON.stringify(guideData.languages),
        contact: guideData.contact ? JSON.stringify(guideData.contact) : null,
        experience: guideData.experience,
        rating: guideData.rating,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Guide created successfully',
      data: guide,
    });
  } catch (error) {
    console.error('Error creating guide:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create guide',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllGuides = async (req: Request, res: Response) => {
  try {
    const guides = await prisma.guide.findMany({
      where: {
        isActive: true,
      },
      include: {
        tourGuides: {
          include: {
            tour: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    const formattedGuides = guides.map(guide => ({
      ...guide,
      name: JSON.parse(guide.name),
      description: guide.description ? JSON.parse(guide.description) : null,
      languages: JSON.parse(guide.languages),
      contact: guide.contact ? JSON.parse(guide.contact) : null,
    }));

    return res.json({
      success: true,
      data: formattedGuides,
    });
  } catch (error) {
    console.error('Error fetching guides:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch guides',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getGuidesByTour = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;

    const tourGuides = await prisma.tourGuide.findMany({
      where: {
        tourId: parseInt(tourId),
        guide: {
          isActive: true,
        },
      },
      include: {
        guide: true,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    const formattedGuides = tourGuides.map(tg => ({
      ...tg.guide,
      name: JSON.parse(tg.guide.name),
      description: tg.guide.description ? JSON.parse(tg.guide.description) : null,
      languages: JSON.parse(tg.guide.languages),
      contact: tg.guide.contact ? JSON.parse(tg.guide.contact) : null,
      isDefault: tg.isDefault,
    }));

    return res.json({
      success: true,
      data: formattedGuides,
    });
  } catch (error) {
    console.error('Error fetching guides for tour:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch guides for tour',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateGuide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const guideData: Partial<GuideData> = req.body;

    const updateData: any = {};
    
    if (guideData.name) updateData.name = JSON.stringify(guideData.name);
    if (guideData.description) updateData.description = JSON.stringify(guideData.description);
    if (guideData.photo !== undefined) updateData.photo = guideData.photo;
    if (guideData.languages) updateData.languages = JSON.stringify(guideData.languages);
    if (guideData.contact) updateData.contact = JSON.stringify(guideData.contact);
    if (guideData.experience !== undefined) updateData.experience = guideData.experience;
    if (guideData.rating !== undefined) updateData.rating = guideData.rating;

    const guide = await prisma.guide.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return res.json({
      success: true,
      message: 'Guide updated successfully',
      data: guide,
    });
  } catch (error) {
    console.error('Error updating guide:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update guide',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteGuide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.guide.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    return res.json({
      success: true,
      message: 'Guide deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating guide:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to deactivate guide',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const linkGuideToTour = async (req: Request, res: Response) => {
  try {
    const { tourId, guideId, isDefault } = req.body;

    // If this is set as default, remove default from other guides for this tour
    if (isDefault) {
      await prisma.tourGuide.updateMany({
        where: { tourId },
        data: { isDefault: false },
      });
    }

    const tourGuide = await prisma.tourGuide.upsert({
      where: {
        tourId_guideId: {
          tourId,
          guideId,
        },
      },
      update: {
        isDefault,
      },
      create: {
        tourId,
        guideId,
        isDefault,
      },
    });

    return res.json({
      success: true,
      message: 'Guide linked to tour successfully',
      data: tourGuide,
    });
  } catch (error) {
    console.error('Error linking guide to tour:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to link guide to tour',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};