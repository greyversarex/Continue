import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BookingStartData {
  tourId: number;
  hotelId?: number;
  tourDate: string;
  numberOfTourists: number;
}

interface BookingDetailsData {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  tourists: Array<{
    fullName: string;
    dateOfBirth?: string;
  }>;
  specialRequests?: string;
  roomSelection?: any;
  mealSelection?: any;
}

interface BookingPaymentData {
  paymentMethod: string;
}

export const bookingController = {
  /**
   * Создать черновик бронирования (Шаг 1)
   * POST /api/booking/start
   */
  async startBooking(req: Request, res: Response) {
    try {
      const { tourId, hotelId, tourDate, numberOfTourists }: BookingStartData = req.body;

      // Валидация обязательных полей
      if (!tourId || !tourDate || !numberOfTourists) {
        return res.status(400).json({
          success: false,
          message: 'Tour ID, tour date, and number of tourists are required'
        });
      }

      // Проверка существования тура
      const tour = await prisma.tour.findUnique({
        where: { id: parseInt(tourId.toString()) },
        include: {
          category: true,
          tourHotels: {
            include: {
              hotel: true
            }
          }
        }
      });

      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      // Проверка отеля, если указан
      let hotel = null;
      if (hotelId) {
        hotel = await prisma.hotel.findUnique({
          where: { id: parseInt(hotelId.toString()) }
        });

        if (!hotel) {
          return res.status(404).json({
            success: false,
            message: 'Hotel not found'
          });
        }
      }

      // Создать черновик бронирования
      const booking = await prisma.booking.create({
        data: {
          tourId: parseInt(tourId.toString()),
          hotelId: hotelId ? parseInt(hotelId.toString()) : null,
          tourDate,
          numberOfTourists: parseInt(numberOfTourists.toString()),
          tourists: JSON.stringify([]), // Пустой массив для начала
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          totalPrice: 0, // Будет рассчитана позже
          status: 'draft'
        }
      });

      return res.status(201).json({
        success: true,
        data: {
          bookingId: booking.id,
          tour: {
            ...tour,
            title: JSON.parse(tour.title),
            description: JSON.parse(tour.description)
          },
          hotel: hotel ? {
            ...hotel,
            name: JSON.parse(hotel.name),
            description: hotel.description ? JSON.parse(hotel.description) : null
          } : null
        },
        message: 'Booking draft created successfully'
      });

    } catch (error) {
      console.error('Error creating booking draft:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create booking draft',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Обновить детали бронирования (Шаг 2)
   * PUT /api/booking/:id/details
   */
  async updateBookingDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        contactName, 
        contactPhone, 
        contactEmail, 
        tourists, 
        specialRequests,
        roomSelection,
        mealSelection 
      }: BookingDetailsData = req.body;

      // Валидация обязательных полей
      if (!contactName || !contactPhone || !contactEmail || !tourists || tourists.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Contact details and at least one tourist are required'
        });
      }

      // Найти бронирование
      const existingBooking = await prisma.booking.findUnique({
        where: { id: parseInt(id) },
        include: {
          tour: true,
          hotel: true
        }
      });

      if (!existingBooking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Рассчитать общую стоимость
      let totalPrice = 0;
      
      // Базовая стоимость тура
      const tourPrice = parseFloat(existingBooking.tour.price);
      const tourPriceType = existingBooking.tour.priceType;
      
      if (tourPriceType === 'за человека') {
        totalPrice += tourPrice * existingBooking.numberOfTourists;
      } else {
        totalPrice += tourPrice; // За группу
      }

      // Добавить стоимость номеров (если выбраны)
      if (roomSelection && existingBooking.hotel) {
        const tourDuration = parseInt(existingBooking.tour.duration.replace(/\D/g, '')) || 1;
        
        for (const [roomType, roomData] of Object.entries(roomSelection as any)) {
          const room = roomData as any;
          if (room.quantity > 0) {
            totalPrice += room.price * room.quantity * tourDuration;
          }
        }
      }

      // Добавить стоимость питания (если выбрано)
      if (mealSelection && existingBooking.hotel) {
        const tourDuration = parseInt(existingBooking.tour.duration.replace(/\D/g, '')) || 1;
        
        for (const [mealType, mealData] of Object.entries(mealSelection as any)) {
          const meal = mealData as any;
          if (meal.selected) {
            totalPrice += meal.price * existingBooking.numberOfTourists * tourDuration;
          }
        }
      }

      // Обновить бронирование
      const updatedBooking = await prisma.booking.update({
        where: { id: parseInt(id) },
        data: {
          contactName,
          contactPhone,
          contactEmail,
          tourists: JSON.stringify(tourists),
          specialRequests,
          roomSelection: roomSelection ? JSON.stringify(roomSelection) : null,
          mealSelection: mealSelection ? JSON.stringify(mealSelection) : null,
          totalPrice,
          status: 'pending' // Переводим в состояние ожидания оплаты
        }
      });

      return res.json({
        success: true,
        data: updatedBooking,
        message: 'Booking details updated successfully'
      });

    } catch (error) {
      console.error('Error updating booking details:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update booking details',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Процесс оплаты (Шаг 3 - mock)
   * PUT /api/booking/:id/pay
   */
  async processPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { paymentMethod }: BookingPaymentData = req.body;

      // Найти бронирование
      const booking = await prisma.booking.findUnique({
        where: { id: parseInt(id) }
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Mock обработка оплаты - имитируем успех или ошибку
      const isSuccess = Math.random() > 0.1; // 90% успеха

      if (isSuccess) {
        // Успешная оплата
        const updatedBooking = await prisma.booking.update({
          where: { id: parseInt(id) },
          data: {
            status: 'paid',
            paymentMethod
          }
        });

        return res.json({
          success: true,
          data: updatedBooking,
          message: 'Payment processed successfully'
        });
      } else {
        // Ошибка оплаты
        return res.status(400).json({
          success: false,
          message: 'Payment failed. Please try again.'
        });
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process payment',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Получить детали бронирования
   * GET /api/booking/:id
   */
  async getBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const booking = await prisma.booking.findUnique({
        where: { id: parseInt(id) },
        include: {
          tour: {
            include: {
              category: true
            }
          },
          hotel: true
        }
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Парсим JSON поля для ответа
      const formattedBooking = {
        ...booking,
        tourists: JSON.parse(booking.tourists),
        roomSelection: booking.roomSelection ? JSON.parse(booking.roomSelection) : null,
        mealSelection: booking.mealSelection ? JSON.parse(booking.mealSelection) : null,
        tour: {
          ...booking.tour,
          title: JSON.parse(booking.tour.title),
          description: JSON.parse(booking.tour.description),
          category: {
            ...booking.tour.category,
            name: JSON.parse(booking.tour.category.name)
          }
        },
        hotel: booking.hotel ? {
          ...booking.hotel,
          name: JSON.parse(booking.hotel.name),
          description: booking.hotel.description ? JSON.parse(booking.hotel.description) : null,
          amenities: booking.hotel.amenities ? JSON.parse(booking.hotel.amenities) : [],
        } : null
      };

      return res.json({
        success: true,
        data: formattedBooking
      });

    } catch (error) {
      console.error('Error fetching booking:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch booking',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Получить отели для тура
   * GET /api/booking/tour/:tourId/hotels
   */
  async getTourHotels(req: Request, res: Response) {
    try {
      const { tourId } = req.params;

      const tourHotels = await prisma.tourHotel.findMany({
        where: { tourId: parseInt(tourId) },
        include: {
          hotel: true
        }
      });

      const hotels = tourHotels.map(th => ({
        ...th.hotel,
        name: JSON.parse(th.hotel.name),
        description: th.hotel.description ? JSON.parse(th.hotel.description) : null,
        amenities: th.hotel.amenities ? JSON.parse(th.hotel.amenities) : [],
        images: th.hotel.images ? JSON.parse(th.hotel.images) : []
      }));

      return res.json({
        success: true,
        data: hotels
      });

    } catch (error) {
      console.error('Error fetching tour hotels:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tour hotels',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};