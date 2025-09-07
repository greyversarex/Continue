import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();

// Конфигурация Multer для загрузки файлов водителей
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, 'uploads/drivers/');
  },
  filename: function (req: any, file: any, cb: any) {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB максимум
  },
  fileFilter: function (req, file, cb) {
    // Разрешенные типы файлов для водителей
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Типы транспорта по умолчанию
const DEFAULT_VEHICLE_TYPES = [
  'sedan',      // Легковой автомобиль
  'suv',        // Внедорожник
  'minibus',    // Минивэн
  'bus',        // Автобус
  'truck',      // Грузовик
  'motorcycle', // Мотоцикл
  'taxi'        // Такси
];

// Категории водительских прав
const LICENSE_CATEGORIES = [
  'A',  // Мотоциклы
  'B',  // Легковые автомобили
  'C',  // Грузовые автомобили
  'D',  // Автобусы
  'E',  // С прицепом
  'BE', // B с прицепом
  'CE', // C с прицепом
  'DE'  // D с прицепом
];

// Безопасный парсинг JSON
function safeJsonParse(jsonString: any, defaultValue: any = null) {
  if (!jsonString) return defaultValue;
  if (typeof jsonString === 'object') return jsonString;
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parsing error:', error);
    return defaultValue;
  }
}

// Получение всех водителей для админ-панели
export const getAllDrivers = async (req: Request, res: Response): Promise<void> => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tourDrivers: {
          include: {
            tour: {
              select: { id: true, title: true }
            }
          }
        }
      }
    });

    const formattedDrivers = drivers.map((driver: any) => ({
      ...driver,
      contact: safeJsonParse(driver.contact, {}),
      documents: safeJsonParse(driver.documents, []),
      vehicleTypes: safeJsonParse(driver.vehicleTypes, []),
      vehicleInfo: safeJsonParse(driver.vehicleInfo, []),
      assignedTours: driver.tourDrivers.map((td: any) => td.tour)
    }));

    console.log(`📋 Found ${drivers.length} drivers`);

    res.json({
      success: true,
      data: formattedDrivers,
      message: 'Drivers retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error getting drivers:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении водителей'
    });
  }
};

// Получение водителя по ID
export const getDriverById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const driverId = parseInt(id);

    if (!driverId) {
      res.status(400).json({
        success: false,
        message: 'ID водителя обязателен'
      });
      return;
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        tourDrivers: {
          include: {
            tour: {
              select: { id: true, title: true, status: true, scheduledStartDate: true }
            }
          }
        }
      }
    });

    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Водитель не найден'
      });
      return;
    }

    const formattedDriver = {
      ...driver,
      contact: safeJsonParse(driver.contact, {}),
      documents: safeJsonParse(driver.documents, []),
      vehicleTypes: safeJsonParse(driver.vehicleTypes, []),
      vehicleInfo: safeJsonParse(driver.vehicleInfo, []),
      assignedTours: driver.tourDrivers.map((td: any) => td.tour)
    };

    res.json({
      success: true,
      data: formattedDriver,
      message: 'Driver retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error getting driver:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении водителя'
    });
  }
};

// Создание нового водителя (для админ-панели)
export const createDriverProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      description, 
      login, 
      password, 
      email, 
      phone, 
      languages, 
      experience, 
      licenseNumber,
      licenseCategory,
      vehicleTypes,
      vehicleInfo,
      vehicleBrand,
      vehicleYear,
      workingAreas,
      pricePerDay,
      pricePerHour,
      currency,
      countryId,
      cityId,
      isActive 
    } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log('📝 Получены данные для создания водителя:', req.body);
    console.log('📁 Получены файлы:', files);

    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: 'Имя и email обязательны'
      });
      return;
    }

    // Хешируем пароль для безопасности
    const saltRounds = 10;
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Обрабатываем загруженный аватар
    let photoPath = null;
    if (files && files.avatar && files.avatar[0]) {
      photoPath = files.avatar[0].path;
      console.log('📷 Аватар сохранен:', photoPath);
    }

    // Обрабатываем загруженные документы
    let documentsArray: Array<{
      filename: string;
      originalName: string;
      path: string;
      size: number;
      mimeType: string;
    }> = [];
    if (files && files.documents && files.documents.length > 0) {
      documentsArray = files.documents.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype
      }));
      console.log('📄 Документы сохранены:', documentsArray.length);
    }

    // Обрабатываем загруженные фото транспорта
    let vehiclePhotosArray: Array<{
      filename: string;
      originalName: string;
      path: string;
      size: number;
      mimeType: string;
    }> = [];
    if (files && files.vehiclePhotos && files.vehiclePhotos.length > 0) {
      vehiclePhotosArray = files.vehiclePhotos.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype
      }));
      console.log('🚗 Фото транспорта сохранены:', vehiclePhotosArray.length);
    }

    // Парсим типы транспорта и информацию о машинах
    let parsedVehicleTypes = [];
    if (vehicleTypes) {
      try {
        // Сначала попытаемся распарсить как JSON
        parsedVehicleTypes = typeof vehicleTypes === 'string' ? 
          JSON.parse(vehicleTypes) : vehicleTypes;
      } catch (e) {
        // Если не получилось как JSON, разделим по запятым
        try {
          parsedVehicleTypes = typeof vehicleTypes === 'string' ? 
            vehicleTypes.split(',').map(v => v.trim()) : vehicleTypes;
        } catch (e2) {
          parsedVehicleTypes = [];
        }
      }
    }

    let parsedVehicleInfo = [];
    if (vehicleInfo) {
      try {
        parsedVehicleInfo = typeof vehicleInfo === 'string' ? 
          JSON.parse(vehicleInfo) : vehicleInfo;
      } catch (e) {
        parsedVehicleInfo = [];
      }
    }

    // Создаем водителя
    const driver = await prisma.driver.create({
      data: {
        name: name,
        description: description || 'Профессиональный водитель',
        languages: languages || 'Русский',
        contact: JSON.stringify({ email, phone }),
        experience: experience ? parseInt(experience) : 0,
        rating: 5.0, // Начальный рейтинг
        login: login,
        password: hashedPassword,
        isActive: isActive === 'true' || isActive === true || isActive === undefined,
        photo: photoPath,
        documents: documentsArray.length > 0 ? JSON.stringify(documentsArray) : null,
        licenseNumber: licenseNumber,
        licenseCategory: licenseCategory,
        vehicleTypes: parsedVehicleTypes.length > 0 ? JSON.stringify(parsedVehicleTypes) : null,
        vehicleInfo: parsedVehicleInfo.length > 0 ? JSON.stringify(parsedVehicleInfo) : null,
        vehicleBrand: vehicleBrand,
        vehicleYear: vehicleYear ? parseInt(vehicleYear) : null,
        vehiclePhotos: vehiclePhotosArray.length > 0 ? JSON.stringify(vehiclePhotosArray) : null,
        workingAreas: workingAreas,
        pricePerDay: pricePerDay ? parseFloat(pricePerDay) : null,
        pricePerHour: pricePerHour ? parseFloat(pricePerHour) : null,
        currency: currency || 'TJS',
        countryId: countryId ? parseInt(countryId) : null,
        cityId: cityId ? parseInt(cityId) : null
      }
    });

    console.log('✅ Новый водитель создан:', driver.id);

    res.status(201).json({
      success: true,
      data: {
        id: driver.id,
        name: driver.name,
        description: driver.description,
        languages: driver.languages,
        contact: driver.contact,
        experience: driver.experience,
        rating: driver.rating,
        isActive: driver.isActive,
        photo: driver.photo,
        documents: driver.documents,
        licenseNumber: driver.licenseNumber,
        licenseCategory: driver.licenseCategory,
        vehicleTypes: driver.vehicleTypes,
        vehicleInfo: driver.vehicleInfo
      },
      message: 'Водитель успешно создан с загруженными файлами'
    });

  } catch (error) {
    console.error('❌ Ошибка создания водителя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
};

// Обновление профиля водителя
export const updateDriverProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      email, 
      phone, 
      languages, 
      experience, 
      licenseNumber,
      licenseCategory,
      vehicleTypes,
      vehicleInfo,
      workingAreas,
      pricePerDay,
      pricePerHour,
      currency,
      isActive 
    } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const driverId = parseInt(id);

    console.log('📝 Получены данные для обновления водителя:', req.body);
    console.log('📁 Получены файлы:', files);

    if (!driverId) {
      res.status(400).json({
        success: false,
        message: 'ID водителя обязателен'
      });
      return;
    }

    // Найти существующего водителя
    const existingDriver = await prisma.driver.findUnique({
      where: { id: driverId }
    });

    if (!existingDriver) {
      res.status(404).json({
        success: false,
        message: 'Водитель не найден'
      });
      return;
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (languages) updateData.languages = languages;
    if (experience !== undefined) updateData.experience = parseInt(experience);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;
    if (licenseCategory) updateData.licenseCategory = licenseCategory;
    if (workingAreas) updateData.workingAreas = workingAreas;
    if (pricePerDay) updateData.pricePerDay = parseFloat(pricePerDay);
    if (pricePerHour) updateData.pricePerHour = parseFloat(pricePerHour);
    if (currency) updateData.currency = currency;

    // Обновляем контакты
    if (email || phone) {
      const currentContact = existingDriver.contact ? JSON.parse(existingDriver.contact) : {};
      updateData.contact = JSON.stringify({
        email: email || currentContact.email,
        phone: phone || currentContact.phone
      });
    }

    // Парсим типы транспорта
    if (vehicleTypes) {
      let parsedVehicleTypes = [];
      try {
        // Если это уже JSON строка, парсим её
        parsedVehicleTypes = typeof vehicleTypes === 'string' ? 
          JSON.parse(vehicleTypes) : vehicleTypes;
        
        // Убеждаемся, что это массив
        if (!Array.isArray(parsedVehicleTypes)) {
          parsedVehicleTypes = [parsedVehicleTypes];
        }
      } catch (e) {
        // Если JSON.parse не работает, возможно это строка с разделителями
        try {
          parsedVehicleTypes = vehicleTypes.split(',').map((v: string) => v.trim());
        } catch (e2) {
          parsedVehicleTypes = [];
        }
      }
      updateData.vehicleTypes = JSON.stringify(parsedVehicleTypes);
    }

    // Парсим информацию о машинах
    if (vehicleInfo) {
      let parsedVehicleInfo = [];
      try {
        parsedVehicleInfo = typeof vehicleInfo === 'string' ? 
          JSON.parse(vehicleInfo) : vehicleInfo;
      } catch (e) {
        parsedVehicleInfo = [];
      }
      updateData.vehicleInfo = JSON.stringify(parsedVehicleInfo);
    }

    // Обрабатываем загруженный аватар
    if (files && files.avatar && files.avatar[0]) {
      updateData.photo = files.avatar[0].path;
      console.log('📷 Аватар обновлен:', files.avatar[0].path);
    }

    // Обрабатываем загруженные документы
    if (files && files.documents && files.documents.length > 0) {
      const documentsArray = files.documents.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype
      }));

      // Сохраняем новые документы, добавляя к существующим
      let existingDocuments = [];
      try {
        existingDocuments = existingDriver.documents ? JSON.parse(existingDriver.documents) : [];
      } catch (e) {
        existingDocuments = [];
      }

      const allDocuments = [...existingDocuments, ...documentsArray];
      updateData.documents = JSON.stringify(allDocuments);
      console.log('📄 Документы обновлены, всего:', allDocuments.length);
    }

    const updatedDriver = await prisma.driver.update({
      where: { id: driverId },
      data: updateData
    });

    console.log('✅ Профиль водителя обновлен:', driverId);

    res.json({
      success: true,
      data: {
        id: updatedDriver.id,
        name: updatedDriver.name,
        description: updatedDriver.description,
        languages: updatedDriver.languages,
        contact: updatedDriver.contact,
        experience: updatedDriver.experience,
        isActive: updatedDriver.isActive,
        photo: updatedDriver.photo,
        documents: updatedDriver.documents,
        licenseNumber: updatedDriver.licenseNumber,
        licenseCategory: updatedDriver.licenseCategory,
        vehicleTypes: updatedDriver.vehicleTypes,
        vehicleInfo: updatedDriver.vehicleInfo
      },
      message: 'Профиль водителя успешно обновлен с файлами'
    });

  } catch (error) {
    console.error('❌ Ошибка обновления водителя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
};

// Удаление водителя
export const deleteDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const driverId = parseInt(id);

    if (!driverId) {
      res.status(400).json({
        success: false,
        message: 'ID водителя обязателен'
      });
      return;
    }

    // Проверяем существование водителя
    const existingDriver = await prisma.driver.findUnique({
      where: { id: driverId }
    });

    if (!existingDriver) {
      res.status(404).json({
        success: false,
        message: 'Водитель не найден'
      });
      return;
    }

    // Удаляем водителя
    await prisma.driver.delete({
      where: { id: driverId }
    });

    console.log('🗑️ Водитель удален:', driverId);

    res.json({
      success: true,
      message: 'Водитель успешно удален'
    });

  } catch (error) {
    console.error('❌ Ошибка удаления водителя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении водителя'
    });
  }
};

// Авторизация водителя
export const loginDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      res.status(400).json({
        success: false,
        message: 'Логин и пароль обязательны'
      });
      return;
    }

    // Ищем водителя по логину
    const driver = await prisma.driver.findFirst({
      where: { 
        login: login,
        isActive: true
      }
    });

    if (!driver) {
      res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
      return;
    }

    // Проверяем пароль
    if (!driver.password) {
      res.status(401).json({
        success: false,
        message: 'Пароль не установлен для этого водителя'
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, driver.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
      return;
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      { driverId: driver.id, login: driver.login },
      process.env.JWT_SECRET || 'driver-secret-key',
      { expiresIn: '7d' }
    );

    console.log(`🔐 Водитель ${driver.name} авторизовался`);

    res.json({
      success: true,
      data: {
        token,
        driver: {
          id: driver.id,
          name: driver.name,
          login: driver.login,
          photo: driver.photo
        }
      },
      message: 'Авторизация успешна'
    });

  } catch (error) {
    console.error('❌ Ошибка авторизации водителя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при авторизации'
    });
  }
};

// Получение информации о доступных типах транспорта и категориях прав
export const getDriverOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: {
        vehicleTypes: DEFAULT_VEHICLE_TYPES,
        licenseCategories: LICENSE_CATEGORIES
      },
      message: 'Driver options retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error getting driver options:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения опций водителя'
    });
  }
};

export { DEFAULT_VEHICLE_TYPES, LICENSE_CATEGORIES };