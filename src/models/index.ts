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
        duration: String(data.duration), // Ensure duration is a string
        price: data.price,
        priceType: data.priceType || 'за человека',
        originalPrice: data.originalPrice || null,
        priceComponents: data.priceComponents || null,
        totalPriceTJS: data.totalPriceTJS || null,
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
        requirements: data.requirements || null,
        tags: data.tags || null,
        location: data.location || null,
        services: data.services || null,
        isFeatured: data.isFeatured || false,
        startDate: data.startDate,
        endDate: data.endDate
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
    if (data.duration) updateData.duration = String(data.duration);
    if (data.price) updateData.price = data.price;
    if (data.priceType !== undefined) updateData.priceType = data.priceType;
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;
    if (data.priceComponents !== undefined) updateData.priceComponents = data.priceComponents;
    if (data.totalPriceTJS !== undefined) updateData.totalPriceTJS = data.totalPriceTJS;
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
   * Get all price calculator components
   */
  static async findAll() {
    return await prisma.priceCalculator.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { componentName: 'asc' }
      ]
    });
  }

  /**
   * Get price calculator component by key
   */
  static async findByKey(componentKey: string) {
    return await prisma.priceCalculator.findUnique({
      where: { componentKey }
    });
  }

  /**
   * Create a new price calculator component
   */
  static async create(data: any) {
    return await prisma.priceCalculator.create({
      data: {
        componentKey: data.componentKey,
        componentName: data.componentName,
        basePrice: parseFloat(data.basePrice),
        category: data.category,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });
  }

  /**
   * Update a price calculator component
   */
  static async update(id: number, data: any) {
    const updateData: any = {};
    
    if (data.componentKey !== undefined) updateData.componentKey = data.componentKey;
    if (data.componentName !== undefined) updateData.componentName = data.componentName;
    if (data.basePrice !== undefined) updateData.basePrice = parseFloat(data.basePrice);
    if (data.category !== undefined) updateData.category = data.category;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return await prisma.priceCalculator.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Delete a price calculator component
   */
  static async delete(id: number) {
    const component = await prisma.priceCalculator.findUnique({ where: { id } });
    if (!component) return false;

    await prisma.priceCalculator.delete({ where: { id } });
    return true;
  }

  /**
   * Initialize default price components
   */
  static async initializeDefaults() {
    const defaultComponents = [
      // Транспорт
      { key: 'transport_suv', name: 'Внедорожник', category: 'transport', price: 500 },
      { key: 'transport_crossover', name: 'Кроссовер', category: 'transport', price: 400 },
      { key: 'transport_minibus', name: 'Микроавтобус', category: 'transport', price: 600 },
      { key: 'transport_bus', name: 'Автобус', category: 'transport', price: 300 },
      
      // Гостиницы
      { key: 'hotel_5star_double', name: '5*, двухместный', category: 'hotel', price: 1200 },
      { key: 'hotel_4star_double', name: '4*, двухместный', category: 'hotel', price: 900 },
      { key: 'hotel_3star_double', name: '3*, двухместный', category: 'hotel', price: 600 },
      { key: 'hotel_2star_double', name: '2*, двухместный', category: 'hotel', price: 400 },
      { key: 'hotel_hostel', name: 'Хостел', category: 'hotel', price: 200 },
      
      // Питание
      { key: 'meals_lunch', name: 'Обед', category: 'meals', price: 150 },
      { key: 'meals_dinner', name: 'Ужин', category: 'meals', price: 200 },
      
      // Проводники
      { key: 'guide_russian', name: 'Русскоговорящий', category: 'guide', price: 800 },
      { key: 'guide_english', name: 'Англоговорящий', category: 'guide', price: 1000 },
      
      // Входные билеты
      { key: 'tickets_local', name: 'В объектах-тадж', category: 'tickets', price: 50 },
      { key: 'tickets_international', name: 'В объектах-инт', category: 'tickets', price: 100 },
      
      // Трансферы
      { key: 'transfer_local', name: 'Аэропорт-дом гостиницы-тадж', category: 'transfer', price: 300 },
      { key: 'transfer_international', name: 'Аэропорт-дом гостиницы-инт', category: 'transfer', price: 500 },
      
      // Документы
      { key: 'documents_gbao', name: 'Разрешение на выезд в ГБАО', category: 'documents', price: 250 },
      { key: 'documents_visa_support', name: 'Виза-поддержка, офиц. приглашение', category: 'documents', price: 400 },
      { key: 'documents_foreign_visa', name: 'Виза в зарубежные страны', category: 'documents', price: 600 }
    ];

    for (const component of defaultComponents) {
      const existing = await this.findByKey(component.key);
      if (!existing) {
        await this.create({
          componentKey: component.key,
          componentName: component.name,
          basePrice: component.price,
          category: component.category,
          isActive: true
        });
      }
    }
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
