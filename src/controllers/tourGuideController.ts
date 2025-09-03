import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tour-guide-secret-key';

// Авторизация тургида
export const loginTourGuide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      res.status(400).json({ 
        success: false, 
        message: 'Логин и пароль обязательны' 
      });
      return;
    }

    // Найти тургида по логину (используем таблицу guide)
    const guide = await prisma.guide.findFirst({
      where: { login },
      select: {
        id: true,
        name: true,
        login: true,
        password: true,
        contact: true,
        isActive: true
      }
    });

    if (!guide) {
      res.status(401).json({ 
        success: false, 
        message: 'Неверный логин или пароль' 
      });
      return;
    }

    if (!guide.isActive) {
      res.status(403).json({ 
        success: false, 
        message: 'Аккаунт деактивирован' 
      });
      return;
    }

    // ✅ БЕЗОПАСНАЯ проверка пароля с поддержкой обратной совместимости
    let validPassword = false;
    
    // Проверяем, что пароль не null
    if (!guide.password) {
      res.status(401).json({ 
        success: false, 
        message: 'Неверный логин или пароль' 
      });
      return;
    }
    
    try {
      // Сначала проверяем как хешированный пароль (новый безопасный способ)
      validPassword = await bcrypt.compare(password, guide.password);
    } catch (error) {
      // Если bcrypt.compare не сработал, это может быть старый нехешированный пароль
      // ВРЕМЕННАЯ поддержка для существующих гидов (постепенная миграция)
      console.warn('⚠️ Legacy password check for guide:', guide.login);
      validPassword = password === guide.password;
      
      // Если пароль совпал и это старый формат - обновим его на хешированный
      if (validPassword) {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          await prisma.guide.update({
            where: { id: guide.id },
            data: { password: hashedPassword }
          });
          console.log('✅ Password migrated to hash for guide:', guide.login);
        } catch (updateError) {
          console.error('❌ Failed to migrate password to hash:', updateError);
        }
      }
    }
    
    if (!validPassword) {
      res.status(401).json({ 
        success: false, 
        message: 'Неверный логин или пароль' 
      });
      return;
    }

    // Создать JWT токен
    const token = jwt.sign(
      { 
        id: guide.id, 
        login: guide.login, 
        name: guide.name,
        type: 'tour-guide'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('🔑 Tour guide login successful:', guide.login);

    res.json({
      success: true,
      token,
      guide: {
        id: guide.id,
        name: guide.name,
        login: guide.login,
        email: guide.contact ? (typeof guide.contact === 'string' ? JSON.parse(guide.contact).email : (guide.contact as any).email) : null,
        phone: guide.contact ? (typeof guide.contact === 'string' ? JSON.parse(guide.contact).phone : (guide.contact as any).phone) : null
      },
      message: 'Авторизация успешна'
    });

  } catch (error) {
    console.error('❌ Tour guide login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
};

// Получить список туров для тургида
export const getGuideTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const guideId = (req as any).user?.id;

    if (!guideId) {
      res.status(401).json({ 
        success: false, 
        message: 'Не авторизован' 
      });
      return;
    }

    const tours = await prisma.tour.findMany({
      where: { 
        isActive: true,
        tourGuides: {
          some: {
            guideId: guideId
          }
        }
      },
      include: {
        bookings: {
          where: { status: { in: ['paid', 'confirmed'] } }
        },
        category: true,
        tourBlock: true
      },
      orderBy: {
        scheduledStartDate: 'asc'
      }
    });

    // Подсчитать количество туристов для каждого тура
    const toursWithStats = tours.map(tour => {
      const totalTourists = tour.bookings.reduce((sum, booking) => {
        return sum + booking.numberOfTourists;
      }, 0);

      return {
        id: tour.id,
        uniqueCode: tour.uniqueCode,
        title: tour.title,
        scheduledStartDate: tour.scheduledStartDate,
        scheduledEndDate: tour.scheduledEndDate,
        status: tour.status,
        totalTourists,
        bookingsCount: tour.bookings.length,
        category: tour.category,
        tourBlock: tour.tourBlock
      };
    });

    console.log(`📋 Found ${tours.length} tours for guide ${guideId}`);

    res.json({
      success: true,
      data: toursWithStats
    });

  } catch (error) {
    console.error('❌ Error getting guide tours:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
};

// Получить детали тура для тургида
export const getTourDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const guideId = (req as any).user?.id;
    const tourId = parseInt(id);

    if (!tourId) {
      res.status(400).json({ 
        success: false, 
        message: 'ID тура обязателен' 
      });
      return;
    }

    const tour = await prisma.tour.findFirst({
      where: { 
        id: tourId,
        assignedGuideId: guideId
      },
      include: {
        bookings: {
          where: { status: { in: ['paid', 'confirmed'] } },
          include: {
            tour: true,
            hotel: true
          }
        },
        category: true,
        tourBlock: true,
        reviews: {
          where: { isApproved: true }
        },
        guideReviews: {
          where: { guideId: guideId }
        }
      }
    });

    if (!tour) {
      res.status(404).json({ 
        success: false, 
        message: 'Тур не найден' 
      });
      return;
    }

    // Извлечь список туристов из бронирований
    const tourists: any[] = [];
    tour.bookings.forEach(booking => {
      if (booking.tourists) {
        try {
          const bookingTourists = JSON.parse(booking.tourists);
          bookingTourists.forEach((tourist: any) => {
            tourists.push({
              ...tourist,
              bookingId: booking.id,
              contactEmail: booking.contactEmail,
              contactPhone: booking.contactPhone
            });
          });
        } catch (e) {
          console.warn('Error parsing tourists data:', e);
        }
      }
    });

    const tourDetails = {
      id: tour.id,
      uniqueCode: tour.uniqueCode,
      title: tour.title,
      description: tour.description,
      itinerary: tour.itinerary,
      scheduledStartDate: tour.scheduledStartDate,
      scheduledEndDate: tour.scheduledEndDate,
      status: tour.status,
      bookings: tour.bookings,
      tourists: tourists,
      totalTourists: tourists.length,
      category: tour.category,
      tourBlock: tour.tourBlock,
      reviews: tour.reviews,
      guideReview: tour.guideReviews[0] || null
    };

    res.json({
      success: true,
      data: tourDetails
    });

  } catch (error) {
    console.error('❌ Error getting tour details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
};

// Начать тур
export const startTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const guideId = (req as any).user?.id;
    const tourId = parseInt(id);

    const tour = await prisma.tour.findFirst({
      where: { 
        id: tourId,
        assignedGuideId: guideId,
        status: 'pending'
      }
    });

    if (!tour) {
      res.status(404).json({ 
        success: false, 
        message: 'Тур не найден или уже начат' 
      });
      return;
    }

    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: { 
        status: 'active' 
      }
    });

    console.log(`🚀 Tour ${tourId} started by guide ${guideId}`);

    res.json({
      success: true,
      data: updatedTour,
      message: 'Тур начат'
    });

  } catch (error) {
    console.error('❌ Error starting tour:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
};

// Завершить тур
export const finishTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const guideId = (req as any).user?.id;
    const tourId = parseInt(id);

    const tour = await prisma.tour.findFirst({
      where: { 
        id: tourId,
        assignedGuideId: guideId,
        status: 'active'
      }
    });

    if (!tour) {
      res.status(404).json({ 
        success: false, 
        message: 'Тур не найден или не активен' 
      });
      return;
    }

    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: { 
        status: 'finished' 
      }
    });

    console.log(`✅ Tour ${tourId} finished by guide ${guideId}`);

    res.json({
      success: true,
      data: updatedTour,
      message: 'Тур завершён'
    });

  } catch (error) {
    console.error('❌ Error finishing tour:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
};

// Собрать отзывы (отправить email туристам)
export const collectReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { selectedTourists } = req.body;
    const guideId = (req as any).user?.id;
    const tourId = parseInt(id);

    if (!selectedTourists || !Array.isArray(selectedTourists)) {
      res.status(400).json({ 
        success: false, 
        message: 'Список туристов обязателен' 
      });
      return;
    }

    const tour = await prisma.tour.findFirst({
      where: { 
        id: tourId,
        assignedGuideId: guideId,
        status: 'finished'
      }
    });

    if (!tour) {
      res.status(404).json({ 
        success: false, 
        message: 'Тур не найден или не завершён' 
      });
      return;
    }

    // Настройка nodemailer (заглушка для демонстрации)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let emailsSent = 0;

    // Отправить email каждому выбранному туристу
    for (const tourist of selectedTourists) {
      if (tourist.email) {
        try {
          const reviewLink = `${process.env.FRONTEND_URL}/review/${tourId}?tourist=${encodeURIComponent(tourist.email)}`;
          
          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: tourist.email,
            subject: 'Оставьте отзыв о туре',
            html: `
              <h2>Здравствуйте, ${tourist.name}!</h2>
              <p>Благодарим вас за участие в туре "${JSON.parse(tour.title).ru}".</p>
              <p>Мы будем благодарны, если вы поделитесь своими впечатлениями:</p>
              <a href="${reviewLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Оставить отзыв</a>
            `
          });
          
          emailsSent++;
        } catch (emailError) {
          console.warn('Failed to send email to:', tourist.email, emailError);
        }
      }
    }

    console.log(`📧 Sent ${emailsSent} review request emails for tour ${tourId}`);

    res.json({
      success: true,
      emailsSent,
      message: `Отправлено ${emailsSent} писем с просьбой оставить отзыв`
    });

  } catch (error) {
    console.error('❌ Error collecting reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
};

// Оставить отзыв тургида о туре
export const leaveGuideReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const guideId = (req as any).user?.id;
    const tourId = parseInt(id);

    if (!content || content.trim().length === 0) {
      res.status(400).json({ 
        success: false, 
        message: 'Текст отзыва обязателен' 
      });
      return;
    }

    const tour = await prisma.tour.findFirst({
      where: { 
        id: tourId,
        assignedGuideId: guideId,
        status: 'finished'
      }
    });

    if (!tour) {
      res.status(404).json({ 
        success: false, 
        message: 'Тур не найден или не завершён' 
      });
      return;
    }

    // Проверить, есть ли уже отзыв от этого тургида
    const existingReview = await prisma.guideReview.findUnique({
      where: {
        tourId_guideId: {
          tourId: tourId,
          guideId: guideId
        }
      }
    });

    let review;
    if (existingReview) {
      // Обновить существующий отзыв
      review = await prisma.guideReview.update({
        where: { id: existingReview.id },
        data: { content: content.trim() }
      });
    } else {
      // Создать новый отзыв
      review = await prisma.guideReview.create({
        data: {
          tourId: tourId,
          guideId: guideId,
          content: content.trim()
        }
      });
    }

    console.log(`💬 Guide review ${existingReview ? 'updated' : 'created'} for tour ${tourId}`);

    res.json({
      success: true,
      data: review,
      message: 'Отзыв сохранён'
    });

  } catch (error) {
    console.error('❌ Error leaving guide review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
};

// Создание нового тургида с аутентификацией (для админ панели)
export const createTourGuideProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, login, password, email, phone, languages, experience, isActive } = req.body;

    console.log('📝 Получены данные для создания гида:', req.body);

    if (!name || !email || !languages) {
      res.status(400).json({ 
        success: false, 
        message: 'Имя, email и языки обязательны' 
      });
      return;
    }

    // Хешируем пароль для безопасности
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ИСПРАВЛЕНО: Создаем в таблице Guide вместо TourGuideProfile
    const guide = await prisma.guide.create({
      data: {
        name: name, // Сохраняем как простую строку, а не JSON
        description: description || 'Профессиональный гид',
        languages: languages, // Строка языков через запятую
        contact: JSON.stringify({ email, phone }), // Контакты в JSON
        experience: experience ? parseInt(experience) : 0,
        rating: 5.0, // Начальный рейтинг
        login: login, // Добавляем логин
        password: hashedPassword, // ✅ БЕЗОПАСНО: Храним хешированный пароль
        isActive: isActive !== undefined ? isActive : true,
        photo: null // Пока без фото
      }
    });

    console.log('✅ Новый гид создан в таблице Guide:', guide.id);

    res.status(201).json({
      success: true,
      data: {
        id: guide.id,
        name: guide.name,
        description: guide.description,
        languages: guide.languages,
        contact: guide.contact,
        experience: guide.experience,
        rating: guide.rating,
        isActive: guide.isActive
      },
      message: 'Гид успешно создан'
    });

  } catch (error) {
    console.error('❌ Ошибка создания гида:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
};