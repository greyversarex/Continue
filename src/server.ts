import app from './app';
import prisma from './config/database';

// For deployment, use PORT from environment (usually 8080 for Cloud Run)
// For development, use 3001 to match the workflow configuration
const PORT = process.env.NODE_ENV === 'production' 
  ? parseInt(process.env.PORT || '8080', 10)
  : parseInt(process.env.PORT || '3001', 10);
const HOST = '0.0.0.0';

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start the server
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Tajik Trails API server is running on http://${HOST}:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5000'}`);
      console.log(`🔗 Health check: http://${HOST}:${PORT}/api/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await prisma.$disconnect();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await prisma.$disconnect();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
