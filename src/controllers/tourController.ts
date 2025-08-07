import { Request, Response, NextFunction } from 'express';
import { TourModel, CategoryModel } from '../models';
import { CreateTourData, ApiResponse, MultilingualContent } from '../types';

export class TourController {
  /**
   * Get all tours
   * GET /api/tours
   */
  static async getAllTours(req: Request, res: Response, next: NextFunction) {
    try {
      const tours = await TourModel.findAll();
      
      // Parse JSON fields for response
      const parsedTours = tours.map(tour => ({
        ...tour,
        title: JSON.parse(tour.title) as MultilingualContent,
        description: JSON.parse(tour.description) as MultilingualContent,
        category: tour.category ? {
          ...tour.category,
          name: JSON.parse(tour.category.name) as MultilingualContent
        } : null
      }));

      const response: ApiResponse = {
        success: true,
        data: parsedTours,
        message: 'Tours retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single tour by ID
   * GET /api/tours/:id
   */
  static async getTourById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid tour ID'
        });
      }

      const tour = await TourModel.findById(id);
      
      if (!tour) {
        return res.status(404).json({
          success: false,
          error: 'Tour not found'
        });
      }

      // Parse JSON fields for response
      const parsedTour = {
        ...tour,
        title: JSON.parse(tour.title) as MultilingualContent,
        description: JSON.parse(tour.description) as MultilingualContent,
        category: tour.category ? {
          ...tour.category,
          name: JSON.parse(tour.category.name) as MultilingualContent
        } : null
      };

      const response: ApiResponse = {
        success: true,
        data: parsedTour,
        message: 'Tour retrieved successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create a new tour
   * POST /api/tours
   */
  static async createTour(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, duration, price, categoryId }: CreateTourData = req.body;

      // Validation
      if (!title || !title.en || !title.ru) {
        return res.status(400).json({
          success: false,
          error: 'Title is required in both English and Russian'
        });
      }

      if (!description || !description.en || !description.ru) {
        return res.status(400).json({
          success: false,
          error: 'Description is required in both English and Russian'
        });
      }

      if (!duration) {
        return res.status(400).json({
          success: false,
          error: 'Duration is required'
        });
      }

      if (!price) {
        return res.status(400).json({
          success: false,
          error: 'Price is required'
        });
      }

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          error: 'Category ID is required'
        });
      }

      const tour = await TourModel.create({
        title,
        description,
        duration,
        price,
        categoryId
      });

      // Parse JSON fields for response
      const parsedTour = {
        ...tour,
        title: JSON.parse(tour.title) as MultilingualContent,
        description: JSON.parse(tour.description) as MultilingualContent,
        category: tour.category ? {
          ...tour.category,
          name: JSON.parse(tour.category.name) as MultilingualContent
        } : null
      };

      const response: ApiResponse = {
        success: true,
        data: parsedTour,
        message: 'Tour created successfully'
      };

      return res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'Category not found') {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }
      return next(error);
    }
  }

  /**
   * Get all categories
   * GET /api/categories
   */
  static async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryModel.findAll();
      
      // Parse JSON fields for response
      const parsedCategories = categories.map(category => ({
        ...category,
        name: JSON.parse(category.name) as MultilingualContent
      }));

      const response: ApiResponse = {
        success: true,
        data: parsedCategories,
        message: 'Categories retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
