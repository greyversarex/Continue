const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const { initializeDatabase } = require('./src/database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для парсинга JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Booking pages - explicit routes BEFORE static middleware
app.get('/booking.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'booking.html'));
});

app.get('/booking-flow.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'booking-flow.html'));
});

// React Admin Panel - explicit route BEFORE static middleware
app.get('/react-admin-panel.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'react-admin-panel.html'));
});

// Simple Admin Panel - explicit route BEFORE static middleware
app.get('/simple-admin-panel.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'simple-admin-panel.html'));
});

// Simplified API routes with test data
app.use('/api', (req, res) => {
  console.log('API request:', req.method, req.path);
  
  // Tour blocks endpoint
  if (req.path === '/tour-blocks') {
    const mockTourBlocks = [
      { id: 1, title: { ru: "Популярные туры", en: "Popular Tours" }, slug: "popular-tours", isActive: true, sortOrder: 1 },
      { id: 2, title: { ru: "Рекомендованные туры по Центральной Азии", en: "Recommended Tours in Central Asia" }, slug: "central-asia-tours", isActive: true, sortOrder: 2 },
      { id: 3, title: { ru: "Туры по Таджикистану", en: "Tajikistan Tours" }, slug: "tajikistan-tours", isActive: true, sortOrder: 3 },
      { id: 4, title: { ru: "Туры по Узбекистану", en: "Uzbekistan Tours" }, slug: "uzbekistan-tours", isActive: true, sortOrder: 4 },
      { id: 5, title: { ru: "Туры по Киргизстану", en: "Kyrgyzstan Tours" }, slug: "kyrgyzstan-tours", isActive: true, sortOrder: 5 },
      { id: 6, title: { ru: "Туры по Туркменистану", en: "Turkmenistan Tours" }, slug: "turkmenistan-tours", isActive: true, sortOrder: 6 },
      { id: 7, title: { ru: "Туры по Казахстану", en: "Kazakhstan Tours" }, slug: "kazakhstan-tours", isActive: true, sortOrder: 7 }
    ];
    res.json({
      success: true,
      data: mockTourBlocks,
      message: 'Tour blocks retrieved successfully'
    });
    return;
  }
  
  // Tours endpoint with sample data for all 7 blocks
  if (req.path.startsWith('/tours')) {
    const mockTours = [
      // Популярные туры (блок 1)
      {
        id: 1,
        title: { ru: "Памирский тракт - дорога через крышу мира", en: "Pamir Highway - Road Through the Roof of the World" },
        description: { ru: "Увлекательное путешествие по самой высокой дороге в мире", en: "Exciting journey on the world's highest road" },
        price: 850, priceType: "за человека", duration: "7 дней", durationDays: 7, tourBlockId: 1,
        mainImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        country: "Таджикистан", city: "Душанбе",
        category: { id: 1, name: { ru: "Приключенческие туры", en: "Adventure Tours" } }, isFeatured: true
      },
      {
        id: 2,
        title: { ru: "Озеро Искандеркуль", en: "Lake Iskanderkul" },
        description: { ru: "Красивейшее озеро Таджикистана", en: "Most beautiful lake in Tajikistan" },
        price: 450, priceType: "за человека", duration: "3 дня", durationDays: 3, tourBlockId: 1,
        mainImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop",
        country: "Таджикистан", city: "Душанбе",
        category: { id: 2, name: { ru: "Природные туры", en: "Nature Tours" } }, isFeatured: true
      },
      
      // Центральная Азия (блок 2)
      {
        id: 3,
        title: { ru: "Великий шелковый путь", en: "Great Silk Road" },
        description: { ru: "Путешествие по древнему торговому пути", en: "Journey along the ancient trade route" },
        price: 1200, priceType: "за человека", duration: "10 дней", durationDays: 10, tourBlockId: 2,
        mainImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
        country: "Узбекистан", city: "Самарканд",
        category: { id: 3, name: { ru: "Исторические туры", en: "Historical Tours" } }, isFeatured: false
      },
      
      // Таджикистан (блок 3)
      {
        id: 4,
        title: { ru: "Фанские горы - треккинг", en: "Fann Mountains Trekking" },
        description: { ru: "Незабываемый поход в горах Таджикистана", en: "Unforgettable hiking in Tajikistan mountains" },
        price: 680, priceType: "за человека", duration: "5 дней", durationDays: 5, tourBlockId: 3,
        mainImage: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop",
        country: "Таджикистан", city: "Пенджикент",
        category: { id: 4, name: { ru: "Горные походы", en: "Mountain Hiking" } }, isFeatured: false
      },
      
      // Узбекистан (блок 4)
      {
        id: 5,
        title: { ru: "Сокровища Узбекистана", en: "Treasures of Uzbekistan" },
        description: { ru: "Исследование древних городов Узбекистана", en: "Exploring ancient cities of Uzbekistan" },
        price: 750, priceType: "за человека", duration: "6 дней", durationDays: 6, tourBlockId: 4,
        mainImage: "https://images.unsplash.com/photo-1578644337189-6b0f5eb2cd28?w=600&h=400&fit=crop",
        country: "Узбекистан", city: "Бухара",
        category: { id: 3, name: { ru: "Исторические туры", en: "Historical Tours" } }, isFeatured: false
      },
      
      // Киргизстан (блок 5)
      {
        id: 6,
        title: { ru: "Озеро Иссык-Куль", en: "Lake Issyk-Kul" },
        description: { ru: "Отдых на жемчужине Киргизии", en: "Rest at the pearl of Kyrgyzstan" },
        price: 520, priceType: "за человека", duration: "4 дня", durationDays: 4, tourBlockId: 5,
        mainImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        country: "Киргизстан", city: "Бишкек",
        category: { id: 2, name: { ru: "Природные туры", en: "Nature Tours" } }, isFeatured: false
      },
      
      // Туркменистан (блок 6)
      {
        id: 7,
        title: { ru: "Врата ада - Дарваза", en: "Gates of Hell - Darvaza" },
        description: { ru: "Посещение знаменитого газового кратера", en: "Visit to the famous gas crater" },
        price: 890, priceType: "за человека", duration: "3 дня", durationDays: 3, tourBlockId: 6,
        mainImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
        country: "Туркменистан", city: "Ашхабад",
        category: { id: 1, name: { ru: "Приключенческие туры", en: "Adventure Tours" } }, isFeatured: false
      },
      
      // Казахстан (блок 7)
      {
        id: 8,
        title: { ru: "Алматы и Алматинские горы", en: "Almaty and Almaty Mountains" },
        description: { ru: "Исследование гор и природы Казахстана", en: "Exploring Kazakhstan's mountains and nature" },
        price: 620, priceType: "за человека", duration: "4 дня", durationDays: 4, tourBlockId: 7,
        mainImage: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop",
        country: "Казахстан", city: "Алматы",
        category: { id: 2, name: { ru: "Природные туры", en: "Nature Tours" } }, isFeatured: false
      }
    ];
    
    // Filter by blockId if requested
    const blockId = req.query.blockId;
    let filteredTours = mockTours;
    if (blockId) {
      filteredTours = mockTours.filter(tour => tour.tourBlockId === parseInt(blockId));
    }
    
    res.json({
      success: true,
      data: filteredTours,
      message: 'Tours retrieved successfully'
    });
    return;
  }
  
  // Slides endpoint
  if (req.path === '/slides') {
    const mockSlides = [
      {
        id: 1,
        title: { ru: "Добро пожаловать в Центральную Азию", en: "Welcome to Central Asia" },
        description: { ru: "Откройте для себя красоту горных стран", en: "Discover the beauty of mountain countries" },
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
        isActive: true,
        order: 1
      }
    ];
    res.json({
      success: true,
      data: mockSlides,
      message: 'Slides retrieved successfully'
    });
    return;
  }
  
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.path
  });
});

// HTML files will be served by express.static

// Обслуживать статические файлы из папки frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Обслуживать главную страницу
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Глобальная обработка ошибок
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Инициализация базы данных
async function startServer() {
  try {
    console.log('🗄️ Инициализация базы данных...');
    await initializeDatabase();
    console.log('🗄️ База данных готова к работе');
    
    console.log('Starting backend API server...');
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Unified server running on port ${PORT}`);
      console.log(`📱 Frontend: http://0.0.0.0:${PORT}`);
      console.log(`🔧 Admin: http://0.0.0.0:${PORT}/admin-dashboard.html`);
      console.log(`🌐 API: http://0.0.0.0:${PORT}/api`);
      console.log('🗄️  База данных: database.db');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
}

startServer();