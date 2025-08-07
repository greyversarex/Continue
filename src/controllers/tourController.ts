import { Request, Response, NextFunction } from 'express';
import { TourModel, CategoryModel, BookingRequestModel, ReviewModel } from '../models';
import { sendAdminNotification, sendCustomerConfirmation } from '../config/email';
import { 
  CreateTourData, 
  CreateCategoryData,
  CreateBookingRequestData,
  CreateReviewData,
  UpdateReviewData,
  ApiResponse, 
  MultilingualContent 
} from '../types';

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
   * Update a tour
   * PUT /api/tours/:id
   */
  static async updateTour(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid tour ID'
        });
      }

      const { title, description, duration, price, categoryId } = req.body;

      // Validation for provided fields
      if (title && (!title.en || !title.ru)) {
        return res.status(400).json({
          success: false,
          error: 'Title must include both English and Russian'
        });
      }

      if (description && (!description.en || !description.ru)) {
        return res.status(400).json({
          success: false,
          error: 'Description must include both English and Russian'
        });
      }

      const updateData: Partial<CreateTourData> = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (duration) updateData.duration = duration;
      if (price) updateData.price = price;
      if (categoryId) updateData.categoryId = categoryId;

      const tour = await TourModel.update(id, updateData);

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
        message: 'Tour updated successfully'
      };

      return res.status(200).json(response);
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
   * Delete a tour
   * DELETE /api/tours/:id
   */
  static async deleteTour(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid tour ID'
        });
      }

      // Check if tour exists
      const existingTour = await TourModel.findById(id);
      if (!existingTour) {
        return res.status(404).json({
          success: false,
          error: 'Tour not found'
        });
      }

      await TourModel.delete(id);

      const response: ApiResponse = {
        success: true,
        message: 'Tour deleted successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}

export class CategoryController {
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

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get a single category by ID
   * GET /api/categories/:id
   */
  static async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }

      const category = await CategoryModel.findById(id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }

      // Parse JSON fields for response
      const parsedCategory = {
        ...category,
        name: JSON.parse(category.name) as MultilingualContent,
        tours: category.tours?.map(tour => ({
          ...tour,
          title: JSON.parse(tour.title) as MultilingualContent,
          description: JSON.parse(tour.description) as MultilingualContent
        }))
      };

      const response: ApiResponse = {
        success: true,
        data: parsedCategory,
        message: 'Category retrieved successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create a new category
   * POST /api/categories
   */
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name }: CreateCategoryData = req.body;

      // Validation
      if (!name || !name.en || !name.ru) {
        return res.status(400).json({
          success: false,
          error: 'Name is required in both English and Russian'
        });
      }

      const category = await CategoryModel.create({ name });

      // Parse JSON fields for response
      const parsedCategory = {
        ...category,
        name: JSON.parse(category.name) as MultilingualContent
      };

      const response: ApiResponse = {
        success: true,
        data: parsedCategory,
        message: 'Category created successfully'
      };

      return res.status(201).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update a category
   * PUT /api/categories/:id
   */
  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }

      const { name } = req.body;

      // Validation for provided fields
      if (name && (!name.en || !name.ru)) {
        return res.status(400).json({
          success: false,
          error: 'Name must include both English and Russian'
        });
      }

      const updateData: Partial<CreateCategoryData> = {};
      if (name) updateData.name = name;

      const category = await CategoryModel.update(id, updateData);

      // Parse JSON fields for response
      const parsedCategory = {
        ...category,
        name: JSON.parse(category.name) as MultilingualContent
      };

      const response: ApiResponse = {
        success: true,
        data: parsedCategory,
        message: 'Category updated successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete a category
   * DELETE /api/categories/:id
   */
  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }

      // Check if category exists
      const existingCategory = await CategoryModel.findById(id);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }

      await CategoryModel.delete(id);

      const response: ApiResponse = {
        success: true,
        message: 'Category deleted successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}

export class BookingRequestController {
  /**
   * Get all booking requests (admin)
   * GET /api/booking-requests
   */
  static async getAllBookingRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const bookingRequests = await BookingRequestModel.findAll();
      
      // Parse JSON fields for response
      const parsedBookingRequests = bookingRequests.map(request => ({
        ...request,
        tour: {
          ...request.tour,
          title: JSON.parse(request.tour.title) as MultilingualContent,
          description: JSON.parse(request.tour.description) as MultilingualContent,
          category: {
            ...request.tour.category,
            name: JSON.parse(request.tour.category.name) as MultilingualContent
          }
        }
      }));

      const response: ApiResponse = {
        success: true,
        data: parsedBookingRequests,
        message: 'Booking requests retrieved successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create a new booking request (public)
   * POST /api/booking-requests
   */
  static async createBookingRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerName, customerEmail, preferredDate, numberOfPeople, tourId }: CreateBookingRequestData = req.body;

      // Validation
      if (!customerName) {
        return res.status(400).json({
          success: false,
          error: 'Customer name is required'
        });
      }

      if (!customerEmail) {
        return res.status(400).json({
          success: false,
          error: 'Customer email is required'
        });
      }

      if (!preferredDate) {
        return res.status(400).json({
          success: false,
          error: 'Preferred date is required'
        });
      }

      if (!numberOfPeople || numberOfPeople < 1) {
        return res.status(400).json({
          success: false,
          error: 'Number of people must be at least 1'
        });
      }

      if (!tourId) {
        return res.status(400).json({
          success: false,
          error: 'Tour ID is required'
        });
      }

      const bookingRequest = await BookingRequestModel.create({
        customerName,
        customerEmail,
        preferredDate,
        numberOfPeople,
        tourId
      });

      // Parse JSON fields for response
      const parsedBookingRequest = {
        ...bookingRequest,
        tour: {
          ...bookingRequest.tour,
          title: JSON.parse(bookingRequest.tour.title) as MultilingualContent,
          description: JSON.parse(bookingRequest.tour.description) as MultilingualContent,
          category: {
            ...bookingRequest.tour.category,
            name: JSON.parse(bookingRequest.tour.category.name) as MultilingualContent
          }
        }
      };

      // Send email notifications
      try {
        const tourTitle = parsedBookingRequest.tour.title.en || parsedBookingRequest.tour.title.ru || 'Tour';
        
        const emailData = {
          fullName: customerName,
          email: customerEmail,
          preferredDate,
          numberOfPeople,
          tourTitle
        };

        // Send notifications (don't wait for them to complete to avoid delaying the response)
        sendAdminNotification(emailData).catch(emailError => {
          console.error('Failed to send admin notification email:', emailError);
        });

        sendCustomerConfirmation(emailData).catch(emailError => {
          console.error('Failed to send customer confirmation email:', emailError);
        });
        
        console.log('Email notifications initiated for booking request:', bookingRequest.id);
      } catch (emailError) {
        // Log email errors but don't fail the booking creation
        console.error('Error initiating email notifications:', emailError);
      }

      const response: ApiResponse = {
        success: true,
        data: parsedBookingRequest,
        message: 'Booking request created successfully'
      };

      return res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'Tour not found') {
        return res.status(400).json({
          success: false,
          error: 'Invalid tour ID'
        });
      }
      return next(error);
    }
  }
}

export class ReviewController {
  /**
   * Get all reviews (admin)
   * GET /api/reviews
   */
  static async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewModel.findAll();
      
      // Parse JSON fields for response
      const parsedReviews = reviews.map(review => ({
        ...review,
        tour: {
          ...review.tour,
          title: JSON.parse(review.tour.title) as MultilingualContent,
          description: JSON.parse(review.tour.description) as MultilingualContent,
          category: {
            ...review.tour.category,
            name: JSON.parse(review.tour.category.name) as MultilingualContent
          }
        }
      }));

      const response: ApiResponse = {
        success: true,
        data: parsedReviews,
        message: 'Reviews retrieved successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create a new review (public)
   * POST /api/reviews
   */
  static async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorName, rating, text, tourId }: CreateReviewData = req.body;

      // Validation
      if (!authorName) {
        return res.status(400).json({
          success: false,
          error: 'Author name is required'
        });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: 'Rating must be between 1 and 5'
        });
      }

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Review text is required'
        });
      }

      if (!tourId) {
        return res.status(400).json({
          success: false,
          error: 'Tour ID is required'
        });
      }

      const review = await ReviewModel.create({
        authorName,
        rating,
        text,
        tourId
      });

      // Parse JSON fields for response
      const parsedReview = {
        ...review,
        tour: {
          ...review.tour,
          title: JSON.parse(review.tour.title) as MultilingualContent,
          description: JSON.parse(review.tour.description) as MultilingualContent,
          category: {
            ...review.tour.category,
            name: JSON.parse(review.tour.category.name) as MultilingualContent
          }
        }
      };

      const response: ApiResponse = {
        success: true,
        data: parsedReview,
        message: 'Review created successfully. It will be visible after moderation.'
      };

      return res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'Tour not found') {
        return res.status(400).json({
          success: false,
          error: 'Invalid tour ID'
        });
      }
      if (error instanceof Error && error.message === 'Rating must be between 1 and 5') {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
      return next(error);
    }
  }

  /**
   * Update review moderation status (admin)
   * PUT /api/reviews/:id
   */
  static async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid review ID'
        });
      }

      const { isModerated }: UpdateReviewData = req.body;

      if (typeof isModerated !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'isModerated must be a boolean value'
        });
      }

      const review = await ReviewModel.update(id, { isModerated });

      // Parse JSON fields for response
      const parsedReview = {
        ...review,
        tour: {
          ...review.tour,
          title: JSON.parse(review.tour.title) as MultilingualContent,
          description: JSON.parse(review.tour.description) as MultilingualContent,
          category: {
            ...review.tour.category,
            name: JSON.parse(review.tour.category.name) as MultilingualContent
          }
        }
      };

      const response: ApiResponse = {
        success: true,
        data: parsedReview,
        message: 'Review updated successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}
