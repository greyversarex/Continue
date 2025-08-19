import { Request, Response } from 'express';
import { HotelModel } from '../models';

// Get all hotels
export const getHotels = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tourId } = req.query;
    
    let hotels;
    if (tourId) {
      // Get hotels for specific tour
      hotels = await HotelModel.findByTourId(parseInt(tourId as string));
    } else {
      // Get all hotels
      hotels = await HotelModel.findAll();
    }

    return res.json({
      success: true,
      data: hotels
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching hotels',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get single hotel
export const getHotel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const hotel = await HotelModel.findById(parseInt(id));
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    return res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching hotel',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create hotel
export const createHotel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const hotelData = req.body;
    
    const hotel = await HotelModel.create(hotelData);

    return res.status(201).json({
      success: true,
      data: hotel,
      message: 'Hotel created successfully'
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating hotel',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update hotel
export const updateHotel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const hotelData = req.body;
    
    const hotel = await HotelModel.update(parseInt(id), hotelData);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    return res.json({
      success: true,
      data: hotel,
      message: 'Hotel updated successfully'
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating hotel',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete hotel
export const deleteHotel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const deleted = await HotelModel.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    return res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting hotel',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Add hotel to tour
export const addHotelToTour = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tourId, hotelId } = req.params;
    const { pricePerNight, isDefault } = req.body;
    
    const tourHotel = await HotelModel.addToTour(
      parseInt(tourId), 
      parseInt(hotelId), 
      pricePerNight,
      isDefault
    );

    return res.json({
      success: true,
      data: tourHotel,
      message: 'Hotel added to tour successfully'
    });
  } catch (error) {
    console.error('Error adding hotel to tour:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding hotel to tour',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Remove hotel from tour
export const removeHotelFromTour = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tourId, hotelId } = req.params;
    
    const removed = await HotelModel.removeFromTour(parseInt(tourId), parseInt(hotelId));

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Hotel-Tour association not found'
      });
    }

    return res.json({
      success: true,
      message: 'Hotel removed from tour successfully'
    });
  } catch (error) {
    console.error('Error removing hotel from tour:', error);
    return res.status(500).json({
      success: false,
      message: 'Error removing hotel from tour',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};