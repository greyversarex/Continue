const express = require('express');
const path = require('path');
const { exec } = require('child_process');
// Remove old SQLite initialization
// const { initializeDatabase } = require('./src/database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для парсинга JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS middleware - restrict to known origins in production
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// NEW Booking system - 3-step process (moved higher for priority)
app.get('/booking/step1', (req, res) => {
  console.log('📋 Serving booking step 1 with params:', req.query);
  res.sendFile(path.join(__dirname, 'frontend', 'booking-step1.html'));
});

app.get('/booking/step2', (req, res) => {
  console.log('📋 Serving booking step 2 with params:', req.query);
  res.sendFile(path.join(__dirname, 'frontend', 'booking-step2.html'));
});

app.get('/booking/step3', (req, res) => {
  console.log('📋 Serving booking step 3 with params:', req.query);
  res.sendFile(path.join(__dirname, 'frontend', 'booking-step3.html'));
});

app.get('/booking-step3.html', (req, res) => {
  console.log('📋 Serving booking-step3.html with params:', req.query);
  res.sendFile(path.join(__dirname, 'frontend', 'booking-step3.html'));
});

// Legacy booking pages - to be removed later
// app.get('/booking.html', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'booking.html'));
// });

// app.get('/booking-flow.html', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'booking-flow.html'));
// });

// React Admin Panel - explicit route BEFORE static middleware
app.get('/react-admin-panel.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'react-admin-panel.html'));
});

// Simple Admin Panel - explicit route BEFORE static middleware
app.get('/simple-admin-panel.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'simple-admin-panel.html'));
});

// Import TypeScript backend routes directly (with better error handling)
try {
  require('ts-node/register');
  const apiRoutes = require('./src/routes/index.ts').default;
  app.use('/api', apiRoutes);
  
  // Add object storage routes directly (without /api prefix) for image serving
  const objectStorageRoutes = require('./src/routes/objectStorageRoutes.ts').default;
  app.use('/', objectStorageRoutes);
  console.log('✅ Backend API routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading backend routes:', error.message);
  console.log('🔄 Running in frontend-only mode');
}

// ИСПРАВЛЕНИЕ: Обработка repl_preview параметров и всех возможных путей
app.get('/', (req, res) => {
  console.log('🏠 Serving home page with query params:', req.query);
  console.log('🏠 Request URL:', req.url);
  console.log('🏠 Request path:', req.path);
  // Игнорируем repl_preview параметры и всегда отдаем главную страницу
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Обработка закодированных repl_preview параметров
app.use((req, res, next) => {
  // Декодируем URL для проверки
  const decodedUrl = decodeURIComponent(req.url);
  console.log('🔄 Middleware check - Original URL:', req.url);
  console.log('🔄 Middleware check - Decoded URL:', decodedUrl);
  
  // Если это запрос с repl_preview параметрами (даже закодированными)
  if (decodedUrl.includes('repl_preview') && req.path === '/') {
    console.log('🏠 Serving home page for repl_preview request');
    return res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  }
  
  // Продолжаем обработку
  next();
});

// Add direct route for /api/objects/direct/* to serve uploaded images
app.use('/api/objects/direct', express.static(path.join(__dirname, 'uploads/images')));

// Add upload routes for simple image handling
const uploadRoutes = require('./src/routes/uploadRoutes.ts').default;
app.use('/upload', uploadRoutes);

// HTML files will be served by express.static

// Обслуживать статические файлы из папки frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Обслуживать загруженные файлы из папки attached_assets
app.use('/attached_assets', express.static(path.join(__dirname, 'attached_assets')));

// SECURITY: Restrict uploads access - remove public serving of sensitive documents
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// TODO: Implement authenticated document access via API endpoints

// Tour template page - explicit route BEFORE static middleware
app.get('/tour-template.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'tour-template.html'));
});

// Hotel template page - explicit route BEFORE static middleware
app.get('/hotel-template.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'hotel-template.html'));
});

// Hotels catalog page - explicit route BEFORE static middleware
app.get('/hotels-catalog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'hotels-catalog.html'));
});

// Обработчик корневого пути перенесен выше (строка 81-85)

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
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

// Использование PostgreSQL через Prisma
async function startServer() {
  try {
    console.log('🗄️ Подключение к PostgreSQL через Prisma...');
    
    console.log('Starting backend API server...');
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Unified server running on port ${PORT}`);
      console.log(`📱 Frontend: http://0.0.0.0:${PORT}`);
      console.log(`🔧 Admin: http://0.0.0.0:${PORT}/admin-dashboard.html`);
      console.log(`🌐 API: http://0.0.0.0:${PORT}/api`);
      console.log('🗄️  База данных: PostgreSQL через Prisma');
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