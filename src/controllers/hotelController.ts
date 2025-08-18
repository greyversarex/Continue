import { Request, Response } from 'express';
import prisma from '../config/database';
import { HotelData } from '../types/booking';

export const createHotel = async (req: Request, res: Response) => {
  try {
    const hotelData: HotelData = req.body;
    
    const hotel = await prisma.hotel.create({
      data: {
        name: JSON.stringify(hotelData.name),
        description: hotelData.description ? JSON.stringify(hotelData.description) : null,
        images: hotelData.images ? JSON.stringify(hotelData.images) : null,
        address: hotelData.address,
        rating: hotelData.rating,
        amenities: hotelData.amenities ? JSON.stringify(hotelData.amenities) : null,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel,
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create hotel',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await prisma.hotel.findMany({
      where: {
        isActive: true,
      },
      include: {
        tourHotels: {
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

    const formattedHotels = hotels.map(hotel => ({
      ...hotel,
      name: JSON.parse(hotel.name),
      description: hotel.description ? JSON.parse(hotel.description) : null,
      images: hotel.images ? JSON.parse(hotel.images) : [],
      amenities: hotel.amenities ? JSON.parse(hotel.amenities) : [],
    }));

    return res.json({
      success: true,
      data: formattedHotels,
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch hotels',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getHotelsByTour = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;

    const tourHotels = await prisma.tourHotel.findMany({
      where: {
        tourId: parseInt(tourId),
        hotel: {
          isActive: true,
        },
      },
      include: {
        hotel: true,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    const formattedHotels = tourHotels.map(th => ({
      ...th.hotel,
      name: JSON.parse(th.hotel.name),
      description: th.hotel.description ? JSON.parse(th.hotel.description) : null,
      images: th.hotel.images ? JSON.parse(th.hotel.images) : [],
      amenities: th.hotel.amenities ? JSON.parse(th.hotel.amenities) : [],
      pricePerNight: th.pricePerNight,
      isDefault: th.isDefault,
    }));

    return res.json({
      success: true,
      data: formattedHotels,
    });
  } catch (error) {
    console.error('Error fetching hotels for tour:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch hotels for tour',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hotelData: Partial<HotelData> = req.body;

    const updateData: any = {};
    
    if (hotelData.name) updateData.name = JSON.stringify(hotelData.name);
    if (hotelData.description) updateData.description = JSON.stringify(hotelData.description);
    if (hotelData.images) updateData.images = JSON.stringify(hotelData.images);
    if (hotelData.address !== undefined) updateData.address = hotelData.address;
    if (hotelData.rating !== undefined) updateData.rating = hotelData.rating;
    if (hotelData.amenities) updateData.amenities = JSON.stringify(hotelData.amenities);

    const hotel = await prisma.hotel.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel,
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update hotel',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.hotel.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    return res.json({
      success: true,
      message: 'Hotel deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to deactivate hotel',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const linkHotelToTour = async (req: Request, res: Response) => {
  try {
    const { tourId, hotelId, pricePerNight, isDefault } = req.body;

    // If this is set as default, remove default from other hotels for this tour
    if (isDefault) {
      await prisma.tourHotel.updateMany({
        where: { tourId },
        data: { isDefault: false },
      });
    }

    const tourHotel = await prisma.tourHotel.upsert({
      where: {
        tourId_hotelId: {
          tourId,
          hotelId,
        },
      },
      update: {
        pricePerNight,
        isDefault,
      },
      create: {
        tourId,
        hotelId,
        pricePerNight,
        isDefault,
      },
    });

    return res.json({
      success: true,
      message: 'Hotel linked to tour successfully',
      data: tourHotel,
    });
  } catch (error) {
    console.error('Error linking hotel to tour:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to link hotel to tour',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};