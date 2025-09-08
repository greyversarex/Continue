import { Request, Response, NextFunction } from 'express';
import { TripModel } from '../models/TripModel';

export class TripController {
  /**
   * Get all trips
   * GET /api/trips
   */
  static async getAllTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const trips = await TripModel.findAll();
      
      return res.status(200).json({
        success: true,
        data: trips,
        message: 'Trips retrieved successfully'
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get trip by ID
   * GET /api/trips/:id
   */
  static async getTripById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid trip ID'
        });
      }

      const trip = await TripModel.findById(id);
      
      if (!trip) {
        return res.status(404).json({
          success: false,
          error: 'Trip not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: trip,
        message: 'Trip retrieved successfully'
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create a new trip
   * POST /api/trips
   */
  static async createTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        direction,
        pickupTime,
        pickupLocation,
        routeFrom,
        routeTo,
        dropoffLocation,
        dropoffTime,
        driverId
      } = req.body;

      // Validation
      if (!direction || !pickupTime || !pickupLocation || !routeFrom || !routeTo || !dropoffLocation || !dropoffTime) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required'
        });
      }

      const tripData = {
        direction,
        pickupTime,
        pickupLocation,
        routeFrom,
        routeTo,
        dropoffLocation,
        dropoffTime,
        driverId: driverId ? parseInt(driverId) : null
      };

      const trip = await TripModel.create(tripData);

      return res.status(201).json({
        success: true,
        data: trip,
        message: 'Trip created successfully'
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update trip
   * PUT /api/trips/:id
   */
  static async updateTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid trip ID'
        });
      }

      const {
        direction,
        pickupTime,
        pickupLocation,
        routeFrom,
        routeTo,
        dropoffLocation,
        dropoffTime,
        driverId,
        status
      } = req.body;

      const updateData = {
        direction,
        pickupTime,
        pickupLocation,
        routeFrom,
        routeTo,
        dropoffLocation,
        dropoffTime,
        driverId: driverId ? parseInt(driverId) : null,
        status
      };

      const trip = await TripModel.update(id, updateData);

      return res.status(200).json({
        success: true,
        data: trip,
        message: 'Trip updated successfully'
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete trip
   * DELETE /api/trips/:id
   */
  static async deleteTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid trip ID'
        });
      }

      await TripModel.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Trip deleted successfully'
      });
    } catch (error) {
      return next(error);
    }
  }
}