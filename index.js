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

// Import TypeScript backend routes directly
require('ts-node/register');
const apiRoutes = require('./src/routes/index.ts').default;

// Use the API routes
app.use('/api', apiRoutes);

// HTML files will be served by express.static

// Обслуживать React build или статические файлы
const reactBuildPath = path.join(__dirname, 'frontend', 'build');
const staticPath = path.join(__dirname, 'frontend');

// Проверяем есть ли React build
if (require('fs').existsSync(reactBuildPath)) {
  // Используем React build если есть
  app.use(express.static(reactBuildPath));
  console.log('🎯 Serving React build');
} else {
  // Используем статические HTML файлы как fallback
  app.use(express.static(staticPath));
  console.log('📄 Serving static HTML files');
}

// Hotel template page - explicit route BEFORE static middleware
app.get('/hotel-template.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'hotel-template.html'));
});

// Hotels catalog page - explicit route BEFORE static middleware
app.get('/hotels-catalog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'hotels-catalog.html'));
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

// Note: React SPA routing handled by React Router on client side

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