import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tour-agent-secret-key';

// Конфигурация multer для загрузки файлов
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'agents');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', // Для аватаров
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // Для документов
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла. Разрешены: JPG, PNG, WEBP, PDF, DOC, DOCX'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB лимит
  }
});

// Авторизация турагента
export const loginTourAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      res.status(400).json({ 
        success: false, 
        message: 'Логин и пароль обязательны' 
      });
      return;
    }

    // Найти турагента по логину
    const agent = await prisma.tourAgent.findFirst({
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

    if (!agent) {
      res.status(401).json({ 
        success: false, 
        message: 'Неверный логин или пароль' 
      });
      return;
    }

    if (!agent.isActive) {
      res.status(403).json({ 
        success: false, 
        message: 'Ваш аккаунт заблокирован' 
      });
      return;
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, agent.password || '');
    if (!isPasswordValid) {
      res.status(401).json({ 
        success: false, 
        message: 'Неверный логин или пароль' 
      });
      return;
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      { 
        id: agent.id, 
        login: agent.login, 
        name: agent.name,
        type: 'tourAgent'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('🔑 Турагент успешно авторизован:', agent.login);

    res.json({
      success: true,
      message: 'Успешная авторизация',
      data: {
        id: agent.id,
        name: agent.name,
        login: agent.login,
        token
      }
    });

  } catch (error) {
    console.error('Error in loginTourAgent:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при авторизации' 
    });
  }
};

// Получить всех турагентов
export const getAllTourAgents = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📋 Получение списка турагентов');

    const agents = await prisma.tourAgent.findMany({
      include: {
        agentCountry: true,
        agentCity: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Найдено турагентов: ${agents.length}`);

    // Обрабатываем контактную информацию
    const processedAgents = agents.map(agent => {
      let contact = { phone: '', email: '' };
      if (agent.contact) {
        try {
          contact = JSON.parse(agent.contact);
        } catch (e) {
          console.warn('Ошибка парсинга контакта турагента:', e);
        }
      }

      return {
        ...agent,
        contact
      };
    });

    res.json({
      success: true,
      data: processedAgents
    });

  } catch (error) {
    console.error('Ошибка при получении турагентов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении турагентов'
    });
  }
};

// Получить турагента по ID
export const getTourAgentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    console.log('📋 getTourAgentById called with ID:', id);
    console.log('🔍 Searching for agent with ID:', id);

    const agent = await prisma.tourAgent.findUnique({
      where: { id: parseInt(id) },
      include: {
        agentCountry: true,
        agentCity: true
      }
    });

    if (!agent) {
      console.log('❌ Agent not found');
      res.status(404).json({
        success: false,
        message: 'Турагент не найден'
      });
      return;
    }

    console.log('📦 Found agent: Yes');

    // Обрабатываем контактную информацию
    let contact = { phone: '', email: '' };
    if (agent.contact) {
      try {
        contact = JSON.parse(agent.contact);
      } catch (e) {
        console.warn('Ошибка парсинга контакта турагента:', e);
      }
    }

    const processedAgent = {
      ...agent,
      contact
    };

    console.log('✅ Returning agent data successfully for ID:', id);
    res.json({
      success: true,
      data: processedAgent
    });

  } catch (error) {
    console.error('Ошибка при получении турагента:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении турагента'
    });
  }
};

// Создать нового турагента
export const createTourAgent = async (req: Request, res: Response): Promise<void> => {
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
      isActive,
      // Дополнительные поля
      passportSeries,
      registration,
      organization,
      organizationAddress,
      website,
      residenceAddress,
      countryId,
      cityId
    } = req.body;
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log('📝 Получены данные для создания турагента:', req.body);
    console.log('📁 Получены файлы:', files);

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

    // Обрабатываем загруженный аватар
    let photoPath = null;
    if (files && files.avatar && files.avatar[0]) {
      photoPath = files.avatar[0].path;
      console.log('📷 Аватар сохранен:', photoPath);
    }

    // Обрабатываем документы
    let documents: Array<{name: string, path: string, type: string}> = [];
    if (files && files.documents) {
      documents = files.documents.map(file => ({
        name: file.originalname,
        path: file.path,
        type: file.mimetype
      }));
      console.log('📄 Документы сохранены:', documents.length);
    }

    // Создаем контактную информацию
    const contactInfo = JSON.stringify({
      phone: phone || '',
      email: email || ''
    });

    const newAgent = await prisma.tourAgent.create({
      data: {
        name,
        description: description || 'Профессиональный турагент',
        login,
        password: hashedPassword,
        contact: contactInfo,
        languages,
        experience: experience ? parseInt(experience) : 0,
        isActive: isActive === 'true' || isActive === true,
        avatar: photoPath,
        documents: documents.length > 0 ? JSON.stringify(documents) : null,
        passportSeries: passportSeries || null,
        registration: registration || null,
        organization: organization || null,
        organizationAddress: organizationAddress || null,
        website: website || null,
        residenceAddress: residenceAddress || null,
        countryId: countryId ? parseInt(countryId) : null,
        cityId: cityId ? parseInt(cityId) : null
      }
    });

    console.log('✅ Турагент успешно создан:', newAgent.id);

    res.status(201).json({
      success: true,
      message: 'Турагент успешно создан',
      data: newAgent
    });

  } catch (error: any) {
    console.error('Error creating tour agent:', error);
    
    if (error.code === 'P2002') {
      res.status(400).json({ 
        success: false, 
        message: 'Логин уже используется' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка при создании турагента' 
      });
    }
  }
};

// Обновить турагента
export const updateTourAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      email, 
      phone, 
      languages, 
      experience,
      // Дополнительные поля
      passportSeries,
      registration,
      organization,
      organizationAddress,
      website,
      residenceAddress,
      countryId,
      cityId
    } = req.body;
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log('🔄 Обновление турагента ID:', id);
    console.log('📝 Новые данные:', req.body);

    const agentId = parseInt(id);

    // Проверяем существование турагента
    const existingAgent = await prisma.tourAgent.findUnique({
      where: { id: agentId }
    });

    if (!existingAgent) {
      res.status(404).json({ 
        success: false, 
        message: 'Турагент не найден' 
      });
      return;
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      name,
      description: description || existingAgent.description,
      contact: JSON.stringify({
        phone: phone || '',
        email: email || ''
      }),
      languages,
      experience: experience ? parseInt(experience) : existingAgent.experience,
      passportSeries: passportSeries || existingAgent.passportSeries,
      registration: registration || existingAgent.registration,
      organization: organization || existingAgent.organization,
      organizationAddress: organizationAddress || existingAgent.organizationAddress,
      website: website || existingAgent.website,
      residenceAddress: residenceAddress || existingAgent.residenceAddress,
      countryId: countryId ? parseInt(countryId) : existingAgent.countryId,
      cityId: cityId ? parseInt(cityId) : existingAgent.cityId
    };

    // Обрабатываем новый аватар
    if (files && files.avatar && files.avatar[0]) {
      updateData.avatar = files.avatar[0].path;
      console.log('📷 Новый аватар:', files.avatar[0].path);
    }

    // Обрабатываем документы
    if (files && files.documents) {
      const newDocuments = files.documents.map(file => ({
        name: file.originalname,
        path: file.path,
        type: file.mimetype
      }));
      
      // Объединяем с существующими документами
      let existingDocuments = [];
      if (existingAgent.documents) {
        try {
          existingDocuments = JSON.parse(existingAgent.documents);
        } catch (e) {
          console.warn('Ошибка парсинга существующих документов');
        }
      }
      
      updateData.documents = JSON.stringify([...existingDocuments, ...newDocuments]);
    }

    const updatedAgent = await prisma.tourAgent.update({
      where: { id: agentId },
      data: updateData,
      include: {
        agentCountry: true,
        agentCity: true
      }
    });

    console.log('✅ Турагент успешно обновлен:', updatedAgent.id);

    res.json({
      success: true,
      message: 'Турагент успешно обновлен',
      data: updatedAgent
    });

  } catch (error) {
    console.error('Error updating tour agent:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при обновлении турагента' 
    });
  }
};

// Удалить турагента
export const deleteTourAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const agentId = parseInt(id);

    console.log('🗑️ Удаление турагента ID:', agentId);

    const agent = await prisma.tourAgent.findUnique({
      where: { id: agentId }
    });

    if (!agent) {
      res.status(404).json({ 
        success: false, 
        message: 'Турагент не найден' 
      });
      return;
    }

    await prisma.tourAgent.delete({
      where: { id: agentId }
    });

    console.log('✅ Турагент успешно удален:', agentId);

    res.json({
      success: true,
      message: 'Турагент успешно удален'
    });

  } catch (error) {
    console.error('Error deleting tour agent:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при удалении турагента' 
    });
  }
};

// Удалить документ турагента
export const deleteTourAgentDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { documentPath } = req.body;
    
    const agentId = parseInt(id);
    
    const agent = await prisma.tourAgent.findUnique({
      where: { id: agentId }
    });
    
    if (!agent) {
      res.status(404).json({ 
        success: false, 
        message: 'Турагент не найден' 
      });
      return;
    }
    
    let documents: Array<{name: string, path: string, type: string}> = [];
    if (agent.documents) {
      try {
        documents = JSON.parse(agent.documents);
      } catch (e) {
        console.warn('Ошибка парсинга документов');
      }
    }
    
    // Удаляем документ из массива
    const updatedDocuments = documents.filter((doc: any) => doc.path !== documentPath);
    
    // Обновляем запись в БД
    await prisma.tourAgent.update({
      where: { id: agentId },
      data: {
        documents: JSON.stringify(updatedDocuments)
      }
    });
    
    // Удаляем файл с диска
    try {
      await fs.unlink(documentPath);
    } catch (e) {
      console.warn('Не удалось удалить файл с диска:', e);
    }
    
    res.json({
      success: true,
      message: 'Документ успешно удален'
    });
    
  } catch (error) {
    console.error('Error deleting agent document:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при удалении документа' 
    });
  }
};