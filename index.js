const express = require('express');
const path = require('path');
const { exec } = require('child_process');

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

// Проксирование API запросов к нашему API серверу
app.use('/api', async (req, res) => {
  try {
    // Проксируем запрос к нашему API серверу на порту 3001
    const apiUrl = `http://localhost:3001${req.originalUrl}`;
    
    const fetch = await import('node-fetch').then(m => m.default);
    
    // Подготавливаем заголовки - используем оригинальные заголовки
    const headers = {};
    
    // Добавляем Content-Type только если он был в оригинальном запросе
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'];
    } else {
      headers['Content-Type'] = 'application/json';
    }
    
    headers['Accept'] = 'application/json';
    
    // Добавляем Authorization если есть
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    
    let body;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // Если это JSON, то stringify, иначе передаем как есть
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        body = JSON.stringify(req.body);
      } else {
        body = req.body;
      }
    }
    
    const response = await fetch(apiUrl, {
      method: req.method,
      headers,
      body
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'API server not available',
      details: error.message
    });
  }
});

// Обслуживать HTML файлы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/admin-dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'admin-dashboard.html'));
});

// Backward compatibility for old admin URL
app.get('/admin-cms.html', (req, res) => {
  res.redirect('/admin-dashboard.html');
});

// Visa support page
app.get('/visa-support.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'visa-support.html'));
});

// Статические файлы для фронтенда - AFTER explicit routes
app.use(express.static(path.join(__dirname, 'frontend')));

// Запуск API сервера в фоновом режиме
console.log('Starting backend API server...');
const apiServer = exec('npx ts-node src/server.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('API server error:', error);
  }
});

apiServer.stdout.on('data', (data) => {
  console.log('API:', data.toString().trim());
});

apiServer.stderr.on('data', (data) => {
  console.error('API Error:', data.toString().trim());
});

// Запуск основного сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Unified server running on port ${PORT}`);
  console.log(`📱 Frontend: http://0.0.0.0:${PORT}`);
  console.log(`🔧 Admin: http://0.0.0.0:${PORT}/admin-dashboard.html`);
  console.log(`🌐 API: http://0.0.0.0:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  apiServer.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  apiServer.kill();
  process.exit(0);
});