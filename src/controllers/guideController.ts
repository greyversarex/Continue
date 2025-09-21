import { Request, Response } from 'express';
import prisma from '../config/database';
import { GuideData } from '../types/booking';
import bcrypt from 'bcrypt';

// Безопасная функция для парсинга JSON
function safeJsonParse(value: string | null): any {
  if (!value) return null;
  
  try {
    // Если строка выглядит как JSON (начинается с { или [), парсим её
    if (value.trim().startsWith('{') || value.trim().startsWith('[')) {
      return JSON.parse(value);
    }
    // Иначе возвращаем как простую строку
    return value;
  } catch (error) {
    // Если парсинг не удался, возвращаем исходную строку
    return value;
  }
}

export const createGuide = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      description, 
      photo, 
      languages, 
      contact, 
      experience, 
      rating, 
      isActive,
      login,
      password,
      countryId,
      cityId,
      passportSeries,
      registration,
      residenceAddress
    } = req.body;
    
    // Convert numeric fields
    const experienceNumber = experience ? parseInt(experience) : null;
    const ratingNumber = rating ? parseFloat(rating) : null;
    
    // 🔒 Хешируем пароль для безопасности
    let hashedPassword = null;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }
    
    // ✅ Безопасная обработка isActive с правильным значением по умолчанию
    const active = isActive === undefined ? true : (typeof isActive === 'boolean' ? isActive : String(isActive).toLowerCase() === 'true');
    
    // Проверка уникальности логина если он задан
    if (login) {
      const existingGuide = await prisma.guide.findFirst({ where: { login } });
      if (existingGuide) {
        res.status(400).json({
          success: false,
          message: 'Логин уже используется другим гидом'
        });
        return;
      }
    }
    
    const guide = await prisma.guide.create({
      data: {
        name: typeof name === 'string' ? name : JSON.stringify(name),
        description: description ? (typeof description === 'string' ? description : JSON.stringify(description)) : null,
        photo,
        languages: typeof languages === 'string' ? languages : JSON.stringify(languages),
        contact: contact ? (typeof contact === 'string' ? contact : JSON.stringify(contact)) : null,
        experience: experienceNumber,
        rating: ratingNumber,
        isActive: active,
        login: login || null,
        password: hashedPassword,
        countryId: countryId ? parseInt(String(countryId)) : null,
        cityId: cityId ? parseInt(String(cityId)) : null,
        passportSeries: passportSeries || null,
        registration: registration || null,
        residenceAddress: residenceAddress || null
      },
    });

    // 🔒 БЕЗОПАСНОСТЬ: Исключаем пароль из ответа
    const safeGuide = {
      ...guide,
      password: undefined,
      name: safeJsonParse(guide.name),
      description: safeJsonParse(guide.description),
      languages: safeJsonParse(guide.languages),
      contact: safeJsonParse(guide.contact)
    };
    
    return res.status(201).json({
      success: true,
      message: 'Guide created successfully',
      data: safeGuide,
    });
  } catch (error) {
    console.error('Error creating guide:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create guide',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllGuides = async (req: Request, res: Response) => {
  try {
    const guides = await prisma.guide.findMany({
      where: {
        isActive: true,
      },
      include: {
        tourGuides: {
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

    const formattedGuides = guides.map(guide => {
      try {
        // Fix photo path to be web-accessible
        let photoPath = guide.photo;
        if (photoPath && photoPath.includes('/home/runner/workspace/uploads/')) {
          // Convert absolute path to relative web path
          photoPath = photoPath.replace('/home/runner/workspace/', '/');
        }

        return {
          ...guide,
          photo: photoPath,
          name: safeJsonParse(guide.name),
          description: safeJsonParse(guide.description),
          languages: safeJsonParse(guide.languages),
          contact: safeJsonParse(guide.contact),
          password: undefined, // 🔒 БЕЗОПАСНОСТЬ: Исключаем пароль из ответа
          hasPassword: !!guide.password && guide.password.trim() !== '', // ✅ Показываем наличие пароля
        };
      } catch (error) {
        console.error('Error parsing guide data:', error, guide);
        return guide;
      }
    });

    return res.json({
      success: true,
      data: formattedGuides,
    });
  } catch (error) {
    console.error('Error fetching guides:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch guides',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getGuideById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const guide = await prisma.guide.findUnique({
      where: { id: parseInt(id) },
      include: {
        tourGuides: {
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

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found',
      });
    }

    const formattedGuide = {
      ...guide,
      name: safeJsonParse(guide.name),
      description: safeJsonParse(guide.description),
      languages: safeJsonParse(guide.languages),
      contact: safeJsonParse(guide.contact),
      password: undefined, // 🔒 БЕЗОПАСНОСТЬ: Исключаем пароль из ответа
    };

    return res.json({
      success: true,
      data: formattedGuide,
    });
  } catch (error) {
    console.error('Error fetching guide:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch guide',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getGuidesByTour = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;

    const tourGuides = await prisma.tourGuide.findMany({
      where: {
        tourId: parseInt(tourId),
        guide: {
          isActive: true,
        },
      },
      include: {
        guide: true,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    const formattedGuides = tourGuides.map(tg => ({
      ...tg.guide,
      name: safeJsonParse(tg.guide.name),
      description: safeJsonParse(tg.guide.description),
      languages: safeJsonParse(tg.guide.languages),
      contact: safeJsonParse(tg.guide.contact),
      isDefault: tg.isDefault,
      password: undefined, // 🔒 БЕЗОПАСНОСТЬ: Исключаем пароль из ответа
    }));

    return res.json({
      success: true,
      data: formattedGuides,
    });
  } catch (error) {
    console.error('Error fetching guides for tour:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch guides for tour',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateGuide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const guideData: Partial<GuideData> = req.body;
    const { login, password, isActive } = req.body;

    const updateData: any = {};
    
    // Handle JSON fields properly - check if already string
    if (guideData.name) {
      updateData.name = typeof guideData.name === 'string' ? guideData.name : JSON.stringify(guideData.name);
    }
    if (guideData.description) {
      updateData.description = typeof guideData.description === 'string' ? guideData.description : JSON.stringify(guideData.description);
    }
    if (guideData.photo !== undefined) updateData.photo = guideData.photo;
    if (guideData.languages) {
      updateData.languages = typeof guideData.languages === 'string' ? guideData.languages : JSON.stringify(guideData.languages);
    }
    if (guideData.contact) {
      updateData.contact = typeof guideData.contact === 'string' ? guideData.contact : JSON.stringify(guideData.contact);
    }
    if (guideData.experience !== undefined) updateData.experience = guideData.experience;
    if (guideData.rating !== undefined) updateData.rating = guideData.rating;
    if (guideData.countryId !== undefined) updateData.countryId = guideData.countryId;
    if (guideData.cityId !== undefined) updateData.cityId = guideData.cityId;
    if (guideData.passportSeries !== undefined) updateData.passportSeries = guideData.passportSeries;
    if (guideData.registration !== undefined) updateData.registration = guideData.registration;
    if (guideData.residenceAddress !== undefined) updateData.residenceAddress = guideData.residenceAddress;
    
    // 🔒 Обработка полей авторизации с проверками
    if (login !== undefined) {
      // Проверка уникальности логина
      if (login.trim()) {
        const existingGuide = await prisma.guide.findFirst({ 
          where: { login: login.trim(), id: { not: parseInt(id) } } 
        });
        if (existingGuide) {
          res.status(400).json({
            success: false,
            message: 'Логин уже используется другим гидом'
          });
          return;
        }
        updateData.login = login.trim();
      }
    }
    
    if (isActive !== undefined) {
      // Безопасная обработка boolean
      updateData.isActive = typeof isActive === 'boolean' ? isActive : String(isActive).toLowerCase() === 'true';
    }
    
    // 🔒 Хешируем новый пароль если он передан
    if (password && password.trim()) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password.trim(), saltRounds);
    }

    const guide = await prisma.guide.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    const formattedGuide = {
      ...guide,
      name: safeJsonParse(guide.name),
      description: safeJsonParse(guide.description),
      languages: safeJsonParse(guide.languages),
      contact: safeJsonParse(guide.contact),
      password: undefined, // 🔒 БЕЗОПАСНОСТЬ: Исключаем пароль из ответа
    };

    return res.json({
      success: true,
      message: 'Guide updated successfully',
      data: formattedGuide,
    });
  } catch (error) {
    console.error('Error updating guide:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update guide',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteGuide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.guide.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    return res.json({
      success: true,
      message: 'Guide deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating guide:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to deactivate guide',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const linkGuideToTour = async (req: Request, res: Response) => {
  try {
    const { tourId, guideId, isDefault } = req.body;

    // If this is set as default, remove default from other guides for this tour
    if (isDefault) {
      await prisma.tourGuide.updateMany({
        where: { tourId },
        data: { isDefault: false },
      });
    }

    const tourGuide = await prisma.tourGuide.upsert({
      where: {
        tourId_guideId: {
          tourId,
          guideId,
        },
      },
      update: {
        isDefault,
      },
      create: {
        tourId,
        guideId,
        isDefault,
      },
    });

    return res.json({
      success: true,
      message: 'Guide linked to tour successfully',
      data: tourGuide,
    });
  } catch (error) {
    console.error('Error linking guide to tour:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to link guide to tour',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};