import { Request, Response, NextFunction } from 'express';
import { TourModel, CategoryModel, BookingRequestModel, ReviewModel, TourBlockModel, HotelModel } from '../models';
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
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TourController {
  /**
   * Get all tours
   * GET /api/tours
   */
  static async getAllTours(req: Request, res: Response, next: NextFunction) {
    try {
      const { blockId, limit } = req.query;
      
      let filters: any = {};
      if (blockId) {
        filters.tourBlockId = parseInt(blockId as string);
      }
      
      const tours = await TourModel.search(filters);
      
      // Apply limit if specified
      const limitedTours = limit ? tours.slice(0, parseInt(limit as string)) : tours;
      
      // Parse JSON fields for response with safe parsing
      const parsedTours = limitedTours.map((tour: any) => {
        try {
          // ОПТИМИЗАЦИЯ: Удаляем большие изображения из списка туров для производительности
          const tourWithoutImages = { ...tour };
          delete tourWithoutImages.mainImage;
          delete tourWithoutImages.images;
          
          return {
            ...tourWithoutImages,
            title: tour.title ? JSON.parse(tour.title) as MultilingualContent : { ru: '', en: '' },
            description: tour.description ? JSON.parse(tour.description) as MultilingualContent : { ru: '', en: '' },
            category: tour.category ? {
              ...tour.category,
              name: tour.category.name ? JSON.parse(tour.category.name) as MultilingualContent : { ru: '', en: '' }
            } : null,
            // Добавляем флаг что изображения есть, но не передаем сами изображения
            hasImages: !!(tour.mainImage || tour.images)
          };
        } catch (jsonError) {
          console.error('Error parsing tour JSON fields:', jsonError, 'Tour ID:', tour.id);
          const tourWithoutImages = { ...tour };
          delete tourWithoutImages.mainImage;
          delete tourWithoutImages.images;
          
          return {
            ...tourWithoutImages,
            title: { ru: tour.title || '', en: tour.title || '' },
            description: { ru: tour.description || '', en: tour.description || '' },
            category: tour.category ? {
              ...tour.category,
              name: { ru: tour.category.name || '', en: tour.category.name || '' }
            } : null,
            hasImages: !!(tour.mainImage || tour.images)
          };
        }
      });

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
   * Get tour main image
   * GET /api/tours/:id/main-image
   */
  static async getTourMainImage(req: Request, res: Response, next: NextFunction) {
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

      // Get main image path
      let imagePath = tour.mainImage;
      
      // If no main image, try to get first image from gallery
      if (!imagePath && tour.images) {
        try {
          const images = JSON.parse(tour.images);
          if (images && images.length > 0) {
            imagePath = images[0];
          }
        } catch (e) {
          console.error('Error parsing tour images:', e);
        }
      }

      if (!imagePath) {
        return res.status(404).json({
          success: false,
          error: 'No image found for this tour'
        });
      }

      // Redirect to the image path - this should be handled by object storage middleware
      if (imagePath.startsWith('/objects/')) {
        return res.redirect(imagePath);
      } else {
        // For external URLs, redirect directly
        return res.redirect(imagePath);
      }

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
      console.log('📋 getTourById called with ID:', id);
      
      if (isNaN(id)) {
        console.log('❌ Invalid tour ID provided:', req.params.id);
        return res.status(400).json({
          success: false,
          error: 'Invalid tour ID'
        });
      }

      console.log('🔍 Searching for tour with ID:', id);
      const tour = await TourModel.findById(id);
      console.log('📦 Found tour:', tour ? 'Yes' : 'No');
      
      if (!tour) {
        console.log('❌ Tour not found with ID:', id);
        return res.status(404).json({
          success: false,
          error: 'Tour not found'
        });
      }

      // Parse JSON fields for response - ДЛЯ РЕДАКТИРОВАНИЯ возвращаем ВСЕ данные включая изображения
      let parsedTour;
      try {
        parsedTour = {
          ...tour,
          title: tour.title ? JSON.parse(tour.title) as MultilingualContent : { ru: '', en: '' },
          description: tour.description ? JSON.parse(tour.description) as MultilingualContent : { ru: '', en: '' },
          category: tour.category ? {
            ...tour.category,
            name: tour.category.name ? JSON.parse(tour.category.name) as MultilingualContent : { ru: '', en: '' }
          } : null
          // НЕ удаляем mainImage и images - они нужны для редактирования!
        };
      } catch (jsonError) {
        console.error('Error parsing tour JSON fields:', jsonError, 'Tour ID:', tour.id);
        parsedTour = {
          ...tour,
          title: { ru: tour.title || '', en: tour.title || '' },
          description: { ru: tour.description || '', en: tour.description || '' },
          category: tour.category ? {
            ...tour.category,
            name: { ru: tour.category.name || '', en: tour.category.name || '' }
          } : null
          // НЕ удаляем mainImage и images - они нужны для редактирования!
        };
      }

      const response: ApiResponse = {
        success: true,
        data: parsedTour,
        message: 'Tour retrieved successfully'
      };

      console.log('✅ Returning tour data successfully for ID:', id);
      return res.status(200).json(response);
    } catch (error) {
      console.error('❌ Error in getTourById:', error);
      return next(error);
    }
  }

  /**
   * Create a new tour
   * POST /api/tours
   */
  static async createTour(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Creating tour with data:', req.body);
      let { title, description, shortDescription, duration, price, priceType, originalPrice, categoryId, tourBlockId, country, city, durationDays, format, tourType, difficulty, maxPeople, minPeople, mainImage, images, highlights, itinerary, included, includes, excluded, pickupInfo, startTimeOptions, languages, availableMonths, availableDays, isFeatured, startDate, endDate, rating, reviewsCount, hotelIds, guideIds } = req.body;

      // Parse JSON strings if needed
      if (typeof title === 'string') {
        try {
          title = JSON.parse(title);
          console.log('Parsed title:', title);
        } catch (e) {
          console.error('Failed to parse title:', e);
          return res.status(400).json({
            success: false,
            error: 'Invalid title format'
          });
        }
      }

      // Parse shortDescription if description is not provided
      if (!description && shortDescription) {
        description = shortDescription;
        console.log('Using shortDescription as description:', shortDescription);
      }

      if (typeof description === 'string') {
        try {
          description = JSON.parse(description);
          console.log('Parsed description:', description);
        } catch (e) {
          console.error('Failed to parse description:', e);
          return res.status(400).json({
            success: false,
            error: 'Invalid description format'
          });
        }
      }

      // Validation
      if (!title || !title.en || !title.ru) {
        return res.status(400).json({
          success: false,
          error: 'Title is required in both English and Russian'
        });
      }

      // Make description optional or use shortDescription
      if (description && (typeof description === 'object')) {
        if (!description.en || !description.ru) {
          return res.status(400).json({
            success: false,
            error: 'Description must have both English and Russian versions if provided'
          });
        }
      } else if (!description) {
        // Set default empty description if none provided
        description = { ru: '', en: '' };
        console.log('Using default empty description');
      }

      // Use durationDays if duration is not provided
      const finalDuration = duration || durationDays;
      if (!finalDuration) {
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

      // Convert string fields to numbers for Prisma
      const categoryIdNumber = parseInt(categoryId);
      const tourBlockIdNumber = tourBlockId ? parseInt(tourBlockId) : undefined;
      const durationDaysNumber = durationDays ? parseInt(durationDays) : undefined;
      const maxPeopleNumber = maxPeople ? parseInt(maxPeople) : undefined;
      const minPeopleNumber = minPeople ? parseInt(minPeople) : undefined;
      const ratingNumber = rating ? parseFloat(rating) : undefined;
      const reviewsCountNumber = reviewsCount ? parseInt(reviewsCount) : undefined;
      
      if (isNaN(categoryIdNumber)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID format'
        });
      }

      console.log('Converted numeric fields:', {
        categoryId: categoryIdNumber,
        tourBlockId: tourBlockIdNumber,
        durationDays: durationDaysNumber,
        maxPeople: maxPeopleNumber,
        minPeople: minPeopleNumber,
        rating: ratingNumber,
        reviewsCount: reviewsCountNumber
      });

      console.log('🔄 Starting tour creation in database...');
      
      let tour;
      try {
        tour = await TourModel.create({
        title,
        description,
        shortDescription: shortDescription || null,
        duration: String(finalDuration), // Convert to string for Prisma
        price: String(price),
        priceType: priceType || 'за человека',
        originalPrice: originalPrice || null,
        categoryId: categoryIdNumber,
        tourBlockId: tourBlockIdNumber,
        country: country || null,
        city: city || null,
        format: format || null,
        tourType: tourType || null,
        durationDays: durationDaysNumber,
        difficulty: difficulty || null,
        maxPeople: maxPeopleNumber,
        minPeople: minPeopleNumber,
        mainImage: mainImage || null,
        images: images || null,
        highlights: highlights || null,
        itinerary: itinerary || null,
        included: included || null,
        includes: includes || null,
        excluded: excluded || null,
        pickupInfo: pickupInfo || null,
        startTimeOptions: startTimeOptions || null,
        languages: languages || null,
        availableMonths: availableMonths || null,
        availableDays: availableDays || null,
        isFeatured: isFeatured || false,
        startDate: startDate || null,
        endDate: endDate || null,
        rating: ratingNumber,
        reviewsCount: reviewsCountNumber
      });
      } catch (createError) {
        console.error('❌ Error in TourModel.create:', createError);
        throw createError;
      }
      
      console.log('✅ Tour created successfully in database with ID:', tour.id);

      // Create hotel associations if provided
      if (hotelIds && Array.isArray(hotelIds) && hotelIds.length > 0) {
        console.log('🏨 Creating hotel associations:', hotelIds);
        try {
          const tourHotelData = hotelIds.map((hotelId: number) => ({
            tourId: tour.id,
            hotelId: hotelId,
            isDefault: false
          }));
          
          console.log('🏨 TourHotel data to create:', tourHotelData);
          
          await prisma.tourHotel.createMany({
            data: tourHotelData
          });
          
          console.log('✅ Hotel associations created successfully');
        } catch (hotelError) {
          console.error('❌ Error creating hotel associations:', hotelError);
          throw hotelError;
        }
      }

      // Create guide associations if provided
      if (guideIds && Array.isArray(guideIds) && guideIds.length > 0) {
        console.log('👨‍🏫 Creating guide associations:', guideIds);
        try {
          const tourGuideData = guideIds.map((guideId: number) => ({
            tourId: tour.id,
            guideId: guideId,
            isDefault: false
          }));
          
          console.log('👨‍🏫 TourGuide data to create:', tourGuideData);
          
          await prisma.tourGuide.createMany({
            data: tourGuideData
          });
          
          console.log('✅ Guide associations created successfully');
        } catch (guideError) {
          console.error('❌ Error creating guide associations:', guideError);
          throw guideError;
        }
      }

      // Parse JSON fields for response with safe parsing
      let parsedTour;
      try {
        parsedTour = {
          ...tour,
          title: tour.title ? JSON.parse(tour.title) as MultilingualContent : { ru: '', en: '' },
          description: tour.description ? JSON.parse(tour.description) as MultilingualContent : { ru: '', en: '' },
          category: tour.category ? {
            ...tour.category,
            name: tour.category.name ? JSON.parse(tour.category.name) as MultilingualContent : { ru: '', en: '' }
          } : null
        };
      } catch (jsonError) {
        console.error('Error parsing tour JSON fields:', jsonError, 'Tour ID:', tour.id);
        parsedTour = {
          ...tour,
          title: { ru: tour.title || '', en: tour.title || '' },
          description: { ru: tour.description || '', en: tour.description || '' },
          category: tour.category ? {
            ...tour.category,
            name: { ru: tour.category.name || '', en: tour.category.name || '' }
          } : null
        };
      }

      const response: ApiResponse = {
        success: true,
        data: parsedTour,
        message: 'Tour created successfully'
      };

      return res.status(201).json(response);
    } catch (error) {
      console.error('❌ Error creating tour:', error);
      if (error instanceof Error && error.message === 'Category not found') {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Database error: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
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

      let { title, description, duration, price, categoryId, tourBlockId, country, city, durationDays, format, tourType, priceType, pickupInfo, startTimeOptions, languages, availableMonths, availableDays, startDate, endDate, shortDescription, mainImage, images, highlights, itinerary, included, includes, excluded, difficulty, maxPeople, minPeople, rating, reviewsCount, isFeatured, hotelIds, guideIds } = req.body;

      // Parse JSON strings if needed (same as createTour)
      if (typeof title === 'string') {
        try {
          title = JSON.parse(title);
          console.log('Parsed title for update:', title);
        } catch (e) {
          console.error('Failed to parse title:', e);
          return res.status(400).json({
            success: false,
            error: 'Invalid title format'
          });
        }
      }

      if (typeof description === 'string') {
        try {
          description = JSON.parse(description);
          console.log('Parsed description for update:', description);
        } catch (e) {
          console.error('Failed to parse description:', e);
          return res.status(400).json({
            success: false,
            error: 'Invalid description format'
          });
        }
      }

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

      // Convert numeric fields like in createTour
      const categoryIdNumber = categoryId ? parseInt(categoryId) : undefined;
      const tourBlockIdNumber = tourBlockId ? parseInt(tourBlockId) : undefined;
      const durationDaysNumber = durationDays ? parseInt(durationDays) : undefined;
      const maxPeopleNumber = maxPeople ? parseInt(maxPeople) : undefined;
      const minPeopleNumber = minPeople ? parseInt(minPeople) : undefined;
      const ratingNumber = rating ? parseFloat(rating) : undefined;
      const reviewsCountNumber = reviewsCount ? parseInt(reviewsCount) : undefined;

      const updateData: Partial<CreateTourData> = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (shortDescription) updateData.shortDescription = shortDescription;
      if (duration) updateData.duration = String(duration);
      if (price) updateData.price = String(price);
      if (categoryIdNumber) updateData.categoryId = categoryIdNumber;
      if (tourBlockIdNumber !== undefined) updateData.tourBlockId = tourBlockIdNumber;
      if (country !== undefined) updateData.country = country;
      if (city !== undefined) updateData.city = city;
      if (durationDaysNumber !== undefined) updateData.durationDays = durationDaysNumber;
      if (format !== undefined) updateData.format = format;
      if (tourType !== undefined) updateData.tourType = tourType;
      if (priceType !== undefined) updateData.priceType = priceType;
      if (pickupInfo !== undefined) updateData.pickupInfo = pickupInfo;
      if (startTimeOptions !== undefined) updateData.startTimeOptions = startTimeOptions;
      if (languages !== undefined) updateData.languages = languages;
      if (availableMonths !== undefined) updateData.availableMonths = availableMonths;
      if (availableDays !== undefined) updateData.availableDays = availableDays;
      if (startDate !== undefined) updateData.startDate = startDate;
      if (endDate !== undefined) updateData.endDate = endDate;
      if (mainImage !== undefined) updateData.mainImage = mainImage;
      if (images !== undefined) updateData.images = images;
      if (highlights !== undefined) updateData.highlights = highlights;
      if (itinerary !== undefined) updateData.itinerary = itinerary;
      if (included !== undefined) updateData.included = included;
      if (includes !== undefined) updateData.includes = includes;
      if (excluded !== undefined) updateData.excluded = excluded;
      if (difficulty !== undefined) updateData.difficulty = difficulty;
      if (maxPeopleNumber !== undefined) updateData.maxPeople = maxPeopleNumber;
      if (minPeopleNumber !== undefined) updateData.minPeople = minPeopleNumber;
      if (ratingNumber !== undefined) updateData.rating = ratingNumber;
      if (reviewsCountNumber !== undefined) updateData.reviewsCount = reviewsCountNumber;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

      const tour = await TourModel.update(id, updateData);

      // Update hotel associations if provided
      if (hotelIds && Array.isArray(hotelIds)) {
        console.log('🏨 Updating hotel associations:', hotelIds);
        
        // Delete existing associations
        await prisma.tourHotel.deleteMany({
          where: { tourId: id }
        });
        
        // Create new associations
        if (hotelIds.length > 0) {
          const tourHotelData = hotelIds.map(hotelId => ({
            tourId: id,
            hotelId: hotelId,
            isDefault: false
          }));
          
          await prisma.tourHotel.createMany({
            data: tourHotelData
          });
        }
      }

      // Update guide associations if provided
      if (guideIds && Array.isArray(guideIds)) {
        console.log('👨‍🏫 Updating guide associations:', guideIds);
        
        // Delete existing associations
        await prisma.tourGuide.deleteMany({
          where: { tourId: id }
        });
        
        // Create new associations
        if (guideIds.length > 0) {
          const tourGuideData = guideIds.map(guideId => ({
            tourId: id,
            guideId: guideId,
            isDefault: false
          }));
          
          await prisma.tourGuide.createMany({
            data: tourGuideData
          });
        }
      }

      // Parse JSON fields for response with safe parsing
      let parsedTour;
      try {
        parsedTour = {
          ...tour,
          title: tour.title ? JSON.parse(tour.title) as MultilingualContent : { ru: '', en: '' },
          description: tour.description ? JSON.parse(tour.description) as MultilingualContent : { ru: '', en: '' },
          category: tour.category ? {
            ...tour.category,
            name: tour.category.name ? JSON.parse(tour.category.name) as MultilingualContent : { ru: '', en: '' }
          } : null
        };
      } catch (jsonError) {
        console.error('Error parsing tour JSON fields:', jsonError, 'Tour ID:', tour.id);
        parsedTour = {
          ...tour,
          title: { ru: tour.title || '', en: tour.title || '' },
          description: { ru: tour.description || '', en: tour.description || '' },
          category: tour.category ? {
            ...tour.category,
            name: { ru: tour.category.name || '', en: tour.category.name || '' }
          } : null
        };
      }

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

  /**
   * Search tours with advanced filtering
   * GET /api/tours/search
   */
  static async searchTours(req: Request, res: Response, next: NextFunction) {
    try {
      const { 
        query,
        country, 
        city, 
        format, 
        duration, 
        theme, 
        category,
        date,
        dateFrom, 
        dateTo 
      } = req.query;

      // Build filter conditions
      const filters: any[] = [];

      // Text search across multiple fields
      if (query && typeof query === 'string') {
        const searchQuery = (query as string).toLowerCase().trim();
        const allTours = await TourModel.findAll();
        
        // Filter tours that match the search query
        const matchingTours = allTours.filter((tour: any) => {
          const title = JSON.parse(tour.title) as MultilingualContent;
          const description = JSON.parse(tour.description) as MultilingualContent;
          
          // Check in Russian content
          const titleRu = title.ru?.toLowerCase() || '';
          const descRu = description.ru?.toLowerCase() || '';
          const cityRu = tour.city?.toLowerCase() || '';
          const countryRu = tour.country?.toLowerCase() || '';
          
          // Check in English content  
          const titleEn = title.en?.toLowerCase() || '';
          const descEn = description.en?.toLowerCase() || '';
          
          return titleRu.includes(searchQuery) || 
                 descRu.includes(searchQuery) ||
                 titleEn.includes(searchQuery) ||
                 descEn.includes(searchQuery) ||
                 cityRu.includes(searchQuery) ||
                 countryRu.includes(searchQuery);
        });
        
        if (matchingTours.length > 0) {
          filters.push({ id: { in: matchingTours.map((t: any) => t.id) } });
        } else {
          // No matches found, return empty result
          const response: ApiResponse = {
            success: true,
            data: [],
            message: 'No tours found matching the search criteria'
          };
          return res.status(200).json(response);
        }
      }

      if (country) {
        filters.push({ country: country as string });
      }

      if (city) {
        filters.push({ city: city as string });
      }

      if (format) {
        const formats = (format as string).split(',');
        filters.push({ format: { in: formats } });
      }

      if (category) {
        const categories = (category as string).split(',');
        filters.push({ theme: { in: categories } });
      }

      if (duration) {
        const durationValue = duration as string;
        if (durationValue === '1') {
          filters.push({ durationDays: 1 });
        } else if (durationValue === '2-5') {
          filters.push({ 
            durationDays: {
              gte: 2,
              lte: 5
            }
          });
        } else if (durationValue === '6+') {
          filters.push({ 
            durationDays: {
              gte: 6
            }
          });
        }
      }

      if (theme) {
        const themes = (theme as string).split(',');
        filters.push({ theme: { in: themes } });
      }

      if (date) {
        filters.push({ startDate: { gte: date as string } });
      }

      if (dateFrom || dateTo) {
        const dateConditions: any[] = [];
        if (dateFrom) {
          dateConditions.push({ startDate: { gte: dateFrom as string } });
        }
        if (dateTo) {
          dateConditions.push({ endDate: { lte: dateTo as string } });
        }
        if (dateConditions.length > 0) {
          filters.push(...dateConditions);
        }
      }

      // Use TourModel to search with filters or get all tours if no filters
      const tours = await TourModel.search(filters.length > 0 ? { AND: filters } : {});
      
      // Parse JSON fields for response
      const parsedTours = tours.map((tour: any) => ({
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
        message: 'Tours searched successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get search suggestions for tour search autocomplete
   * GET /api/tours/suggestions
   */
  static async getSearchSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Query parameter is required'
        });
      }

      const searchQuery = query.toLowerCase().trim();
      
      if (searchQuery.length < 2) {
        return res.status(200).json({
          success: true,
          data: [],
          message: 'Query too short'
        });
      }

      // Get tours with titles matching the query
      const tours = await TourModel.findAll();
      
      const suggestions: Array<{text: string, type: string}> = [];
      
      // Add tour suggestions
      tours.forEach((tour: any) => {
        const title = JSON.parse(tour.title) as MultilingualContent;
        
        // Check Russian title
        if (title.ru && title.ru.toLowerCase().includes(searchQuery)) {
          suggestions.push({
            text: title.ru,
            type: 'тур'
          });
        }
        
        // Check English title
        if (title.en && title.en.toLowerCase().includes(searchQuery)) {
          suggestions.push({
            text: title.en,
            type: 'тур'
          });
        }
      });

      // Add location suggestions
      const locations = [
        'Памир', 'Искандеркуль', 'Душанбе', 'Худжанд', 'Файзабад', 
        'Хорог', 'Калаи-Хумб', 'Мургаб', 'Каракуль', 'Ваханский коридор',
        'Самарканд', 'Ташкент', 'Бишкек', 'Алматы'
      ];
      
      locations.forEach(location => {
        if (location.toLowerCase().includes(searchQuery)) {
          suggestions.push({
            text: location,
            type: 'место'
          });
        }
      });

      // Add category suggestions
      const categories = [
        'Горные туры', 'Трекинг', 'Культурные туры', 'Исторические туры',
        'Природные туры', 'Приключенческие туры', 'Гастрономические туры',
        'Однодневные', 'Многодневные', 'VIP туры'
      ];
      
      categories.forEach(category => {
        if (category.toLowerCase().includes(searchQuery)) {
          suggestions.push({
            text: category,
            type: 'категория'
          });
        }
      });

      // Remove duplicates and limit to 6 suggestions
      const uniqueSuggestions = suggestions
        .filter((suggestion, index, self) => 
          index === self.findIndex(s => s.text === suggestion.text)
        )
        .slice(0, 6);

      const response: ApiResponse = {
        success: true,
        data: uniqueSuggestions,
        message: 'Search suggestions retrieved successfully'
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
      const parsedCategories = categories.map((category: any) => ({
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
        tours: category.tours?.map((tour: any) => ({
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
      const { name, title }: CreateCategoryData = req.body;
      
      // Support both 'name' and 'title' fields for flexibility
      const categoryName = name || title;

      // Validation
      if (!categoryName || (!categoryName.en && !categoryName.ru)) {
        return res.status(400).json({
          success: false,
          error: 'Name is required in both English and Russian'
        });
      }

      // Ensure both languages are present
      const finalName = {
        en: categoryName.en || categoryName.ru || '',
        ru: categoryName.ru || categoryName.en || '',
        tj: categoryName.tj || ''
      };

      const category = await CategoryModel.create({ name: finalName });

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
      const parsedBookingRequests = bookingRequests.map((request: any) => ({
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

        // Send notifications (non-critical - don't fail the booking if emails fail)
        const adminEmailResult = await sendAdminNotification(emailData);
        if (!adminEmailResult.success) {
          console.log('📧 Admin notification skipped:', adminEmailResult.reason);
        }

        const customerEmailResult = await sendCustomerConfirmation(emailData);
        if (!customerEmailResult.success) {
          console.log('📧 Customer confirmation skipped:', customerEmailResult.reason);
        }
        
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
      const parsedReviews = reviews.map((review: any) => ({
        ...review,
        customer: review.customer,
        tour: review.tour ? {
          ...review.tour,
          title: JSON.parse(review.tour.title) as MultilingualContent,
          description: JSON.parse(review.tour.description) as MultilingualContent,
          category: {
            ...review.tour.category,
            name: JSON.parse(review.tour.category.name) as MultilingualContent
          }
        } : null
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
      const { customerId, rating, text, tourId, reviewerName, photos }: CreateReviewData = req.body;

      // Validation
      if (!reviewerName) {
        return res.status(400).json({
          success: false,
          error: 'Reviewer name is required'
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
        customerId,
        reviewerName,
        rating,
        text,
        tourId,
        photos
      });

      // Простой ответ без связанных объектов
      const parsedReview = {
        ...review,
        customerId,
        tourId,
        rating,
        text
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
