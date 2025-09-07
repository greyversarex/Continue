"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LICENSE_CATEGORIES = exports.DEFAULT_VEHICLE_TYPES = exports.completeDriverEvent = exports.startDriverEvent = exports.getDriverAssignedEvents = exports.getDriverOptions = exports.loginDriver = exports.deleteDriver = exports.updateDriverProfile = exports.createDriverProfile = exports.getDriverById = exports.getAllDrivers = exports.upload = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/drivers/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
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
        }
        else {
            cb(null, false);
        }
    }
});
const DEFAULT_VEHICLE_TYPES = [
    'sedan',
    'suv',
    'minibus',
    'bus',
    'truck',
    'motorcycle',
    'taxi'
];
exports.DEFAULT_VEHICLE_TYPES = DEFAULT_VEHICLE_TYPES;
const LICENSE_CATEGORIES = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'BE',
    'CE',
    'DE'
];
exports.LICENSE_CATEGORIES = LICENSE_CATEGORIES;
function safeJsonParse(jsonString, defaultValue = null) {
    if (!jsonString)
        return defaultValue;
    if (typeof jsonString === 'object')
        return jsonString;
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        console.warn('JSON parsing error:', error);
        return defaultValue;
    }
}
const getAllDrivers = async (req, res) => {
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
        const formattedDrivers = drivers.map((driver) => ({
            ...driver,
            contact: safeJsonParse(driver.contact, {}),
            documents: safeJsonParse(driver.documents, []),
            vehicleTypes: safeJsonParse(driver.vehicleTypes, []),
            vehicleInfo: safeJsonParse(driver.vehicleInfo, []),
            assignedTours: driver.tourDrivers.map((td) => td.tour)
        }));
        console.log(`📋 Found ${drivers.length} drivers`);
        res.json({
            success: true,
            data: formattedDrivers,
            message: 'Drivers retrieved successfully'
        });
    }
    catch (error) {
        console.error('❌ Error getting drivers:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении водителей'
        });
    }
};
exports.getAllDrivers = getAllDrivers;
const getDriverById = async (req, res) => {
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
            assignedTours: driver.tourDrivers.map((td) => td.tour)
        };
        res.json({
            success: true,
            data: formattedDriver,
            message: 'Driver retrieved successfully'
        });
    }
    catch (error) {
        console.error('❌ Error getting driver:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении водителя'
        });
    }
};
exports.getDriverById = getDriverById;
const createDriverProfile = async (req, res) => {
    try {
        const { name, description, login, password, email, phone, languages, experience, licenseNumber, licenseCategory, vehicleTypes, vehicleInfo, vehicleBrand, vehicleYear, workingAreas, pricePerDay, pricePerHour, currency, countryId, cityId, isActive } = req.body;
        const files = req.files;
        console.log('📝 Получены данные для создания водителя:', req.body);
        console.log('📁 Получены файлы:', files);
        if (!name || !email) {
            res.status(400).json({
                success: false,
                message: 'Имя и email обязательны'
            });
            return;
        }
        const saltRounds = 10;
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        }
        let photoPath = null;
        if (files && files.avatar && files.avatar[0]) {
            photoPath = files.avatar[0].path;
            console.log('📷 Аватар сохранен:', photoPath);
        }
        let documentsArray = [];
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
        let vehiclePhotosArray = [];
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
        let parsedVehicleTypes = [];
        if (vehicleTypes) {
            try {
                parsedVehicleTypes = typeof vehicleTypes === 'string' ?
                    JSON.parse(vehicleTypes) : vehicleTypes;
            }
            catch (e) {
                try {
                    parsedVehicleTypes = typeof vehicleTypes === 'string' ?
                        vehicleTypes.split(',').map(v => v.trim()) : vehicleTypes;
                }
                catch (e2) {
                    parsedVehicleTypes = [];
                }
            }
        }
        let parsedVehicleInfo = [];
        if (vehicleInfo) {
            try {
                parsedVehicleInfo = typeof vehicleInfo === 'string' ?
                    JSON.parse(vehicleInfo) : vehicleInfo;
            }
            catch (e) {
                parsedVehicleInfo = [];
            }
        }
        const driver = await prisma.driver.create({
            data: {
                name: name,
                description: description || 'Профессиональный водитель',
                languages: languages || 'Русский',
                contact: JSON.stringify({ email, phone }),
                experience: experience ? parseInt(experience) : 0,
                rating: 5.0,
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
    }
    catch (error) {
        console.error('❌ Ошибка создания водителя:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера: ' + (error instanceof Error ? error.message : 'Unknown error')
        });
    }
};
exports.createDriverProfile = createDriverProfile;
const updateDriverProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, email, phone, languages, experience, licenseNumber, licenseCategory, vehicleTypes, vehicleInfo, workingAreas, pricePerDay, pricePerHour, currency, isActive } = req.body;
        const files = req.files;
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
        const updateData = {};
        if (name)
            updateData.name = name;
        if (description)
            updateData.description = description;
        if (languages)
            updateData.languages = languages;
        if (experience !== undefined)
            updateData.experience = parseInt(experience);
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (licenseNumber)
            updateData.licenseNumber = licenseNumber;
        if (licenseCategory)
            updateData.licenseCategory = licenseCategory;
        if (workingAreas)
            updateData.workingAreas = workingAreas;
        if (pricePerDay)
            updateData.pricePerDay = parseFloat(pricePerDay);
        if (pricePerHour)
            updateData.pricePerHour = parseFloat(pricePerHour);
        if (currency)
            updateData.currency = currency;
        if (email || phone) {
            const currentContact = existingDriver.contact ? JSON.parse(existingDriver.contact) : {};
            updateData.contact = JSON.stringify({
                email: email || currentContact.email,
                phone: phone || currentContact.phone
            });
        }
        if (vehicleTypes) {
            let parsedVehicleTypes = [];
            try {
                parsedVehicleTypes = typeof vehicleTypes === 'string' ?
                    JSON.parse(vehicleTypes) : vehicleTypes;
                if (!Array.isArray(parsedVehicleTypes)) {
                    parsedVehicleTypes = [parsedVehicleTypes];
                }
            }
            catch (e) {
                try {
                    parsedVehicleTypes = vehicleTypes.split(',').map((v) => v.trim());
                }
                catch (e2) {
                    parsedVehicleTypes = [];
                }
            }
            updateData.vehicleTypes = JSON.stringify(parsedVehicleTypes);
        }
        if (vehicleInfo) {
            let parsedVehicleInfo = [];
            try {
                parsedVehicleInfo = typeof vehicleInfo === 'string' ?
                    JSON.parse(vehicleInfo) : vehicleInfo;
            }
            catch (e) {
                parsedVehicleInfo = [];
            }
            updateData.vehicleInfo = JSON.stringify(parsedVehicleInfo);
        }
        if (files && files.avatar && files.avatar[0]) {
            updateData.photo = files.avatar[0].path;
            console.log('📷 Аватар обновлен:', files.avatar[0].path);
        }
        if (files && files.documents && files.documents.length > 0) {
            const documentsArray = files.documents.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype
            }));
            let existingDocuments = [];
            try {
                existingDocuments = existingDriver.documents ? JSON.parse(existingDriver.documents) : [];
            }
            catch (e) {
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
    }
    catch (error) {
        console.error('❌ Ошибка обновления водителя:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера: ' + (error instanceof Error ? error.message : 'Unknown error')
        });
    }
};
exports.updateDriverProfile = updateDriverProfile;
const deleteDriver = async (req, res) => {
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
        await prisma.driver.delete({
            where: { id: driverId }
        });
        console.log('🗑️ Водитель удален:', driverId);
        res.json({
            success: true,
            message: 'Водитель успешно удален'
        });
    }
    catch (error) {
        console.error('❌ Ошибка удаления водителя:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении водителя'
        });
    }
};
exports.deleteDriver = deleteDriver;
const loginDriver = async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            res.status(400).json({
                success: false,
                message: 'Логин и пароль обязательны'
            });
            return;
        }
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
        if (!driver.password) {
            res.status(401).json({
                success: false,
                message: 'Пароль не установлен для этого водителя'
            });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, driver.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Неверный логин или пароль'
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ driverId: driver.id, login: driver.login }, process.env.JWT_SECRET || 'driver-secret-key', { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error('❌ Ошибка авторизации водителя:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера при авторизации'
        });
    }
};
exports.loginDriver = loginDriver;
const getDriverOptions = async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                vehicleTypes: DEFAULT_VEHICLE_TYPES,
                licenseCategories: LICENSE_CATEGORIES
            },
            message: 'Driver options retrieved successfully'
        });
    }
    catch (error) {
        console.error('❌ Error getting driver options:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка получения опций водителя'
        });
    }
};
exports.getDriverOptions = getDriverOptions;
const getDriverAssignedEvents = async (req, res) => {
    try {
        const driverId = req.driverId;
        if (!driverId) {
            res.status(401).json({
                success: false,
                message: 'ID водителя обязателен'
            });
            return;
        }
        const tours = await prisma.tour.findMany({
            where: {
                isActive: true,
                itinerary: {
                    contains: `"driverId":${driverId}`
                }
            },
            select: {
                id: true,
                title: true,
                itinerary: true,
                startDate: true,
                endDate: true,
                status: true
            }
        });
        const assignedEvents = [];
        tours.forEach(tour => {
            if (tour.itinerary) {
                try {
                    const itinerary = JSON.parse(tour.itinerary);
                    itinerary.forEach((event, index) => {
                        if (event.driverId && parseInt(event.driverId) === driverId) {
                            assignedEvents.push({
                                id: `${tour.id}-${index}`,
                                tourId: tour.id,
                                tourTitle: tour.title,
                                eventIndex: index,
                                time: event.time,
                                title: event.title,
                                description: event.description,
                                status: event.status || 'pending',
                                tourStatus: tour.status,
                                startDate: tour.startDate,
                                endDate: tour.endDate
                            });
                        }
                    });
                }
                catch (e) {
                    console.warn('Error parsing itinerary for tour', tour.id, e);
                }
            }
        });
        res.json({
            success: true,
            data: assignedEvents,
            message: 'Назначенные события получены успешно'
        });
    }
    catch (error) {
        console.error('❌ Error getting driver assigned events:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении назначенных событий'
        });
    }
};
exports.getDriverAssignedEvents = getDriverAssignedEvents;
const startDriverEvent = async (req, res) => {
    try {
        const driverId = req.driverId;
        const { eventId } = req.params;
        if (!driverId || !eventId) {
            res.status(400).json({
                success: false,
                message: 'Необходимы параметры driverId и eventId'
            });
            return;
        }
        const [tourId, eventIndex] = eventId.split('-');
        const tour = await prisma.tour.findUnique({
            where: { id: parseInt(tourId) }
        });
        if (!tour || !tour.itinerary) {
            res.status(404).json({
                success: false,
                message: 'Тур или программа не найдены'
            });
            return;
        }
        const itinerary = JSON.parse(tour.itinerary);
        const eventIdx = parseInt(eventIndex);
        if (eventIdx >= itinerary.length || itinerary[eventIdx].driverId !== driverId) {
            res.status(403).json({
                success: false,
                message: 'Событие не назначено данному водителю'
            });
            return;
        }
        itinerary[eventIdx].status = 'started';
        itinerary[eventIdx].startedAt = new Date().toISOString();
        await prisma.tour.update({
            where: { id: parseInt(tourId) },
            data: { itinerary: JSON.stringify(itinerary) }
        });
        res.json({
            success: true,
            message: 'Событие запущено'
        });
    }
    catch (error) {
        console.error('❌ Error starting driver event:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при запуске события'
        });
    }
};
exports.startDriverEvent = startDriverEvent;
const completeDriverEvent = async (req, res) => {
    try {
        const driverId = req.driverId;
        const { eventId } = req.params;
        if (!driverId || !eventId) {
            res.status(400).json({
                success: false,
                message: 'Необходимы параметры driverId и eventId'
            });
            return;
        }
        const [tourId, eventIndex] = eventId.split('-');
        const tour = await prisma.tour.findUnique({
            where: { id: parseInt(tourId) }
        });
        if (!tour || !tour.itinerary) {
            res.status(404).json({
                success: false,
                message: 'Тур или программа не найдены'
            });
            return;
        }
        const itinerary = JSON.parse(tour.itinerary);
        const eventIdx = parseInt(eventIndex);
        if (eventIdx >= itinerary.length || itinerary[eventIdx].driverId !== driverId) {
            res.status(403).json({
                success: false,
                message: 'Событие не назначено данному водителю'
            });
            return;
        }
        itinerary[eventIdx].status = 'completed';
        itinerary[eventIdx].completedAt = new Date().toISOString();
        await prisma.tour.update({
            where: { id: parseInt(tourId) },
            data: { itinerary: JSON.stringify(itinerary) }
        });
        res.json({
            success: true,
            message: 'Событие завершено'
        });
    }
    catch (error) {
        console.error('❌ Error completing driver event:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при завершении события'
        });
    }
};
exports.completeDriverEvent = completeDriverEvent;
//# sourceMappingURL=driverController.js.map