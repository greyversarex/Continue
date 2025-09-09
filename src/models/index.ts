import prisma from '../config/database';
import { 
  MultilingualContent, 
  CreateTourData, 
  CreateCategoryData, 
  CreateBookingRequestData, 
  CreateReviewData,
  UpdateReviewData 
} from '../types';

export class TourModel {
  /**
   * Get all tours with their categories
   */
  static async findAll() {
    return await prisma.tour.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get a tour by ID
   */
  static async findById(id: number) {
    return await prisma.tour.findUnique({
      where: { id },
      include: {
        category: true,
        tourHotels: {
          include: {
            hotel: true
          }
        },
        tourGuides: {
          include: {
            guide: true
          }
        },
        tourDrivers: {
          include: {
            driver: true
          }
        }
      }
    });
  }

  /**
   * Create a new tour
   */
  static async create(data: CreateTourData) {
    // Validate that the category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return await prisma.tour.create({
      data: {
        title: JSON.stringify(data.title),
        description: JSON.stringify(data.description),
        shortDesc: data.shortDescription ? JSON.stringify(data.shortDescription) : null,
        // New multilingual fields
        titleMultilang: data.titleMultilang ? JSON.stringify(data.titleMultilang) : undefined,
        descriptionMultilang: data.descriptionMultilang ? JSON.stringify(data.descriptionMultilang) : undefined,
        shortDescMultilang: data.shortDescMultilang ? JSON.stringify(data.shortDescMultilang) : undefined,
        duration: String(data.duration), // Ensure duration is a string
        price: data.price,
        priceType: data.priceType || 'за человека',
        originalPrice: data.originalPrice || null,
        categoryId: data.categoryId,
        tourBlockId: data.tourBlockId,
        country: data.country,
        city: data.city,
        format: data.format,
        tourType: data.tourType || null,
        durationDays: data.durationDays || null,
        difficulty: data.difficulty || null,
        maxPeople: data.maxPeople || null,
        minPeople: data.minPeople || null,
        mainImage: data.mainImage || null,
        images: data.images || null,
        highlights: data.highlights || null,
        itinerary: data.itinerary || null,
        included: data.included || null,
        includes: data.includes || null,
        excluded: data.excluded || null,
        pickupInfo: data.pickupInfo || null,
        startTimeOptions: data.startTimeOptions || null,
        languages: data.languages || null,
        availableMonths: data.availableMonths || null,
        availableDays: data.availableDays || null,
        rating: data.rating || null,
        reviewsCount: data.reviewsCount || null,
        theme: data.theme || null,
        assignedGuideId: data.assignedGuideId || null,
        requirements: data.requirements || null,
        tags: data.tags || null,
        location: data.location || null,
        services: data.services || null,
        isFeatured: data.isFeatured || false,
        startDate: data.startDate,
        endDate: data.endDate,
        pricingData: data.pricingComponents || null
      },
      include: {
        category: true
      }
    });
  }

  /**
   * Update a tour
   */
  static async update(id: number, data: Partial<CreateTourData>) {
    const updateData: any = {};

    if (data.title) updateData.title = JSON.stringify(data.title);
    if (data.description) updateData.description = JSON.stringify(data.description);
    if (data.shortDescription) updateData.shortDesc = JSON.stringify(data.shortDescription);
    // New multilingual fields for update
    if (data.titleMultilang !== undefined) updateData.titleMultilang = data.titleMultilang ? JSON.stringify(data.titleMultilang) : undefined;
    if (data.descriptionMultilang !== undefined) updateData.descriptionMultilang = data.descriptionMultilang ? JSON.stringify(data.descriptionMultilang) : undefined;
    if (data.shortDescMultilang !== undefined) updateData.shortDescMultilang = data.shortDescMultilang ? JSON.stringify(data.shortDescMultilang) : undefined;
    if (data.duration) updateData.duration = String(data.duration);
    if (data.price) updateData.price = data.price;
    if (data.priceType !== undefined) updateData.priceType = data.priceType;
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.format !== undefined) updateData.format = data.format;
    if (data.tourType !== undefined) updateData.tourType = data.tourType;
    if (data.durationDays !== undefined) updateData.durationDays = data.durationDays;
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.maxPeople !== undefined) updateData.maxPeople = data.maxPeople;
    if (data.minPeople !== undefined) updateData.minPeople = data.minPeople;
    if (data.mainImage !== undefined) updateData.mainImage = data.mainImage;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.highlights !== undefined) updateData.highlights = data.highlights;
    if (data.itinerary !== undefined) updateData.itinerary = data.itinerary;
    if (data.included !== undefined) updateData.included = data.included;
    if (data.includes !== undefined) updateData.includes = data.includes;
    if (data.excluded !== undefined) updateData.excluded = data.excluded;
    if (data.pickupInfo !== undefined) updateData.pickupInfo = data.pickupInfo;
    if (data.startTimeOptions !== undefined) updateData.startTimeOptions = data.startTimeOptions;
    if (data.languages !== undefined) updateData.languages = data.languages;
    if (data.availableMonths !== undefined) updateData.availableMonths = data.availableMonths;
    if (data.availableDays !== undefined) updateData.availableDays = data.availableDays;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.reviewsCount !== undefined) updateData.reviewsCount = data.reviewsCount;
    if (data.theme !== undefined) updateData.theme = data.theme;
    if (data.requirements !== undefined) updateData.requirements = data.requirements;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.services !== undefined) updateData.services = data.services;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.tourBlockId !== undefined) updateData.tourBlockId = data.tourBlockId;
    if (data.pricingComponents !== undefined) updateData.pricingData = data.pricingComponents;
    if (data.assignedGuideId !== undefined) updateData.assignedGuideId = data.assignedGuideId;
    
    if (data.categoryId) {
      // Validate that the category exists
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
      });
      if (!category) {
        throw new Error('Category not found');
      }
      updateData.categoryId = data.categoryId;
    }

    return await prisma.tour.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });
  }

  /**
   * Delete a tour
   */
  static async delete(id: number) {
    return await prisma.tour.delete({
      where: { id }
    });
  }

  /**
   * Search tours with filters
   */
  static async search(filters: any = {}) {
    return await prisma.tour.findMany({
      where: filters,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}

export class CategoryModel {
  /**
   * Get all categories
   */
  static async findAll() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { tours: true }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });
  }

  /**
   * Get a category by ID
   */
  static async findById(id: number) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        tours: true,
        _count: {
          select: { tours: true }
        }
      }
    });
  }

  /**
   * Create a new category
   */
  static async create(data: CreateCategoryData) {
    return await prisma.category.create({
      data: {
        name: JSON.stringify(data.name)
      }
    });
  }

  /**
   * Update a category
   */
  static async update(id: number, data: Partial<CreateCategoryData>) {
    const updateData: any = {};
    if (data.name) updateData.name = JSON.stringify(data.name);

    return await prisma.category.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Delete a category
   */
  static async delete(id: number) {
    return await prisma.category.delete({
      where: { id }
    });
  }
}

export class BookingRequestModel {
  /**
   * Get all booking requests with tour information
   */
  static async findAll() {
    return await prisma.bookingRequest.findMany({
      include: {
        tour: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get a booking request by ID
   */
  static async findById(id: number) {
    return await prisma.bookingRequest.findUnique({
      where: { id },
      include: {
        tour: {
          include: {
            category: true
          }
        }
      }
    });
  }

  /**
   * Create a new booking request
   */
  static async create(data: CreateBookingRequestData) {
    // Validate that the tour exists
    const tour = await prisma.tour.findUnique({
      where: { id: data.tourId }
    });

    if (!tour) {
      throw new Error('Tour not found');
    }

    return await prisma.bookingRequest.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        preferredDate: data.preferredDate,
        numberOfPeople: data.numberOfPeople,
        tourId: data.tourId
      },
      include: {
        tour: {
          include: {
            category: true
          }
        }
      }
    });
  }

  /**
   * Delete a booking request
   */
  static async delete(id: number) {
    return await prisma.bookingRequest.delete({
      where: { id }
    });
  }
}

export class TourBlockModel {
  /**
   * Get all tour blocks
   */
  static async findAll() {
    return await prisma.tourBlock.findMany({
      include: {
        tours: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });
  }

  /**
   * Get a tour block by ID
   */
  static async findById(id: number) {
    return await prisma.tourBlock.findUnique({
      where: { id },
      include: {
        tours: true
      }
    });
  }

  /**
   * Create a new tour block
   */
  static async create(data: any) {
    return await prisma.tourBlock.create({
      data: {
        title: JSON.stringify(data.title),
        description: JSON.stringify(data.description),
        slug: data.slug,
        sortOrder: data.sortOrder
      }
    });
  }

  /**
   * Update a tour block
   */
  static async update(id: number, data: any) {
    const updateData: any = {};
    if (data.title) updateData.title = JSON.stringify(data.title);
    if (data.description) updateData.description = JSON.stringify(data.description);
    if (data.slug) updateData.slug = data.slug;
    if (data.sortOrder) updateData.sortOrder = data.sortOrder;

    return await prisma.tourBlock.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Delete a tour block
   */
  static async delete(id: number) {
    return await prisma.tourBlock.delete({
      where: { id }
    });
  }
}

export class HotelModel {
  /**
   * Get all hotels
   */
  static async findAll() {
    const hotels = await prisma.hotel.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    return hotels.map((hotel: any) => ({
      ...hotel,
      name: typeof hotel.name === 'string' ? JSON.parse(hotel.name) : hotel.name,
      description: hotel.description && typeof hotel.description === 'string' ? JSON.parse(hotel.description) : hotel.description,
      images: hotel.images && typeof hotel.images === 'string' ? JSON.parse(hotel.images) : (hotel.images || []),
      amenities: hotel.amenities && typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities) : (hotel.amenities || [])
    }));
  }

  /**
   * Get hotels for a specific tour
   */
  static async findByTourId(tourId: number) {
    const tourHotels = await prisma.tourHotel.findMany({
      where: { tourId },
      include: {
        hotel: true
      },
      orderBy: [
        { isDefault: 'desc' },
        { hotel: { name: 'asc' } }
      ]
    });

    return tourHotels.map((th: any) => ({
      ...th.hotel,
      name: typeof th.hotel.name === 'string' ? JSON.parse(th.hotel.name) : th.hotel.name,
      description: th.hotel.description && typeof th.hotel.description === 'string' ? JSON.parse(th.hotel.description) : th.hotel.description,
      images: th.hotel.images && typeof th.hotel.images === 'string' ? JSON.parse(th.hotel.images) : (th.hotel.images || []),
      amenities: th.hotel.amenities && typeof th.hotel.amenities === 'string' ? JSON.parse(th.hotel.amenities) : (th.hotel.amenities || []),
      pricePerNight: th.pricePerNight,
      isDefault: th.isDefault
    }));
  }

  /**
   * Get a hotel by ID
   */
  static async findById(id: number) {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        tourHotels: {
          include: {
            tour: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    if (!hotel) return null;

    return {
      ...hotel,
      name: typeof hotel.name === 'string' ? JSON.parse(hotel.name) : hotel.name,
      description: hotel.description && typeof hotel.description === 'string' ? JSON.parse(hotel.description) : hotel.description,
      images: hotel.images && typeof hotel.images === 'string' ? JSON.parse(hotel.images) : (hotel.images || []),
      amenities: hotel.amenities && typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities) : (hotel.amenities || []),
      tourHotels: hotel.tourHotels.map((th: any) => ({
        ...th,
        tour: {
          ...th.tour,
          title: typeof th.tour.title === 'string' ? JSON.parse(th.tour.title) : th.tour.title
        }
      }))
    };
  }

  /**
   * Create a new hotel
   */
  static async create(data: any) {
    return await prisma.hotel.create({
      data: {
        name: data.name ? (typeof data.name === 'string' ? data.name : JSON.stringify(data.name)) : '{}',
        description: data.description ? (typeof data.description === 'string' ? data.description : JSON.stringify(data.description)) : null,
        images: data.images ? (typeof data.images === 'string' ? data.images : JSON.stringify(data.images)) : null,
        address: data.address,
        rating: data.rating ? parseFloat(data.rating) : null,
        stars: data.stars ? parseInt(data.stars) : null,
        brand: data.brand || null,
        category: data.category || null,
        country: data.country || null,
        city: data.city || null,
        pension: data.pension || 'none',
        amenities: data.amenities ? (typeof data.amenities === 'string' ? data.amenities : JSON.stringify(data.amenities)) : null,
        roomTypes: data.roomTypes ? (typeof data.roomTypes === 'string' ? data.roomTypes : JSON.stringify(data.roomTypes)) : null, // Категории номеров с ценами
        mealTypes: data.mealTypes ? (typeof data.mealTypes === 'string' ? data.mealTypes : JSON.stringify(data.mealTypes)) : null, // НОВОЕ: Типы питания с ценами
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });
  }

  /**
   * Update a hotel
   */
  static async update(id: number, data: any) {
    const updateData: any = {};
    
    if (data.name) updateData.name = typeof data.name === 'string' ? data.name : JSON.stringify(data.name);
    if (data.description) updateData.description = typeof data.description === 'string' ? data.description : JSON.stringify(data.description);
    if (data.images) updateData.images = typeof data.images === 'string' ? data.images : JSON.stringify(data.images);
    if (data.address) updateData.address = data.address;
    if (data.rating !== undefined) updateData.rating = parseFloat(data.rating);
    if (data.stars !== undefined) updateData.stars = data.stars ? parseInt(data.stars) : null;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.pension !== undefined) updateData.pension = data.pension;
    if (data.amenities) updateData.amenities = typeof data.amenities === 'string' ? data.amenities : JSON.stringify(data.amenities);
    if (data.roomTypes) updateData.roomTypes = typeof data.roomTypes === 'string' ? data.roomTypes : JSON.stringify(data.roomTypes); // Категории номеров с ценами
    if (data.mealTypes) updateData.mealTypes = typeof data.mealTypes === 'string' ? data.mealTypes : JSON.stringify(data.mealTypes); // НОВОЕ: Типы питания с ценами
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const hotel = await prisma.hotel.findUnique({ where: { id } });
    if (!hotel) return null;

    return await prisma.hotel.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Delete a hotel
   */
  static async delete(id: number) {
    const hotel = await prisma.hotel.findUnique({ where: { id } });
    if (!hotel) return false;

    await prisma.hotel.delete({ where: { id } });
    return true;
  }

  /**
   * Add hotel to tour
   */
  static async addToTour(tourId: number, hotelId: number, pricePerNight?: number, isDefault: boolean = false) {
    return await prisma.tourHotel.create({
      data: {
        tourId,
        hotelId,
        pricePerNight,
        isDefault
      }
    });
  }

  /**
   * Remove hotel from tour
   */
  static async removeFromTour(tourId: number, hotelId: number) {
    const tourHotel = await prisma.tourHotel.findUnique({
      where: {
        tourId_hotelId: {
          tourId,
          hotelId
        }
      }
    });

    if (!tourHotel) return false;

    await prisma.tourHotel.delete({
      where: {
        tourId_hotelId: {
          tourId,
          hotelId
        }
      }
    });

    return true;
  }
}

export class PriceCalculatorModel {
  /**
   * Get all pricing components
   */
  static async findAll() {
    return await prisma.priceCalculatorComponent.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });
  }

  /**
   * Get pricing component by key
   */
  static async findByKey(key: string) {
    return await prisma.priceCalculatorComponent.findUnique({
      where: { key }
    });
  }

  /**
   * Create a new pricing component
   */
  static async create(data: any) {
    return await prisma.priceCalculatorComponent.create({
      data: {
        key: data.key,
        category: data.category,
        name: data.name,
        price: data.price,
        unit: data.unit,
        description: data.description || null,
        sortOrder: data.sortOrder || 0
      }
    });
  }

  /**
   * Update a pricing component
   */
  static async update(id: number, data: any) {
    return await prisma.priceCalculatorComponent.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        unit: data.unit,
        description: data.description,
        sortOrder: data.sortOrder,
        isActive: data.isActive
      }
    });
  }

  /**
   * Delete a pricing component
   */
  static async delete(id: number) {
    return await prisma.priceCalculatorComponent.delete({
      where: { id }
    });
  }

  /**
   * Initialize default pricing components
   */
  static async initializeDefaults() {
    const defaultComponents = [
      // Транспорт
      { key: 'transport_offroad', category: 'transport', name: 'Транспорт: внедорожник', price: 64.0, unit: 'км', sortOrder: 1 },
      { key: 'transport_crossover', category: 'transport', name: 'Транспорт: кроссовер', price: 64.0, unit: 'км', sortOrder: 2 },
      { key: 'transport_minibus', category: 'transport', name: 'Транспорт: микроавтобус', price: 2200.0, unit: 'день', sortOrder: 3 },
      { key: 'transport_bus', category: 'transport', name: 'Транспорт: автобус', price: 4400.0, unit: 'день', sortOrder: 4 },
      
      // Проживание
      { key: 'accommodation_5star', category: 'accommodation', name: 'Гостиница: 5*, двухместный', price: 1300.0, unit: 'ночь/номер', sortOrder: 1 },
      { key: 'accommodation_4star', category: 'accommodation', name: 'Гостиница: 4*, двухместный', price: 1100.0, unit: 'ночь/номер', sortOrder: 2 },
      { key: 'accommodation_3star', category: 'accommodation', name: 'Гостиница: 3*, двухместный', price: 850.0, unit: 'ночь/номер', sortOrder: 3 },
      { key: 'accommodation_2star', category: 'accommodation', name: 'Гостиница: 2*, двухместный', price: 450.0, unit: 'ночь/номер', sortOrder: 4 },
      { key: 'accommodation_hostel', category: 'accommodation', name: 'Хостел', price: 200.0, unit: 'ночь/номер', sortOrder: 5 },
      
      // Питание
      { key: 'meals_lunch', category: 'meals', name: 'Обед', price: 70.0, unit: 'раз', sortOrder: 1 },
      { key: 'meals_dinner', category: 'meals', name: 'Ужин', price: 65.0, unit: 'раз', sortOrder: 2 },
      
      // Сопровождение
      { key: 'guide_russian', category: 'guides', name: 'Проводник: русскоговорящий', price: 330.0, unit: 'день', sortOrder: 1 },
      { key: 'guide_english', category: 'guides', name: 'Проводник: англоговорящий', price: 650.0, unit: 'день', sortOrder: 2 },
      
      // Билеты и сборы
      { key: 'tickets_local', category: 'tickets', name: 'Входные билеты в объектах (для граждан Таджикистана)', price: 11.0, unit: 'раз', sortOrder: 1 },
      { key: 'tickets_foreign', category: 'tickets', name: 'Входные билеты в объектах (для иностранцев)', price: 33.0, unit: 'раз', sortOrder: 2 },
      
      // Трансфер
      { key: 'transfer_local', category: 'transfer', name: 'Аэропорт-гостиница (для граждан Таджикистана)', price: 330.0, unit: 'человек', sortOrder: 1 },
      { key: 'transfer_foreign', category: 'transfer', name: 'Аэропорт-гостиница (для иностранцев)', price: 550.0, unit: 'человек', sortOrder: 2 },
      
      // Документы и разрешения
      { key: 'documents_gbao', category: 'documents', name: 'Разрешение на въезд в ГБАО', price: 275.0, unit: 'человек', sortOrder: 1 },
      { key: 'documents_visa_support', category: 'documents', name: 'Визовая поддержка (официальное приглашение)', price: 330.0, unit: 'человек', sortOrder: 2 },
      { key: 'documents_foreign_visa', category: 'documents', name: 'Виза в зарубежные страны', price: 1400.0, unit: 'человек', sortOrder: 3 }
    ];

    const results = [];
    for (const component of defaultComponents) {
      try {
        const existing = await this.findByKey(component.key);
        if (!existing) {
          const created = await this.create(component);
          results.push(created);
        }
      } catch (error) {
        console.error(`Error creating component ${component.key}:`, error);
      }
    }
    return results;
  }
}

export class ReviewModel {
  /**
   * Get all reviews with tour information
   */
  static async findAll() {
    return await prisma.review.findMany({
      include: {
        customer: true,
        tour: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get moderated reviews for public display
   */
  static async findModerated() {
    return await prisma.review.findMany({
      where: {
        isModerated: true,
        isApproved: true
      },
      include: {
        customer: true,
        tour: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get reviews for a specific tour
   */
  static async findByTourId(tourId: number) {
    return await prisma.review.findMany({
      where: {
        tourId,
        isModerated: true,
        isApproved: true
      },
      include: {
        customer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get a review by ID
   */
  static async findById(id: number) {
    return await prisma.review.findUnique({
      where: { id },
      include: {
        customer: true,
        tour: {
          include: {
            category: true
          }
        }
      }
    });
  }

  /**
   * Create a new review
   */
  static async create(data: CreateReviewData) {
    // Validate that the tour exists
    const tour = await prisma.tour.findUnique({
      where: { id: data.tourId }
    });

    if (!tour) {
      throw new Error('Tour not found');
    }

    // Validate rating is between 1 and 5
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return await prisma.review.create({
      data: {
        customerId: data.customerId || null,
        reviewerName: data.reviewerName,
        rating: data.rating,
        text: data.text,
        tourId: data.tourId,
        photos: data.photos ? JSON.stringify(data.photos) : null
      },
      include: {
        customer: true,
        tour: {
          include: {
            category: true
          }
        }
      }
    });
  }

  /**
   * Update a review (mainly for moderation)
   */
  static async update(id: number, data: UpdateReviewData) {
    return await prisma.review.update({
      where: { id },
      data,
      include: {
        customer: true,
        tour: {
          include: {
            category: true
          }
        }
      }
    });
  }

  /**
   * Delete a review
   */
  static async delete(id: number) {
    return await prisma.review.delete({
      where: { id }
    });
  }
}
