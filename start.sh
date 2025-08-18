#!/bin/bash
# Startup script for deployment

# Set production environment
export NODE_ENV=production

# Use the PORT environment variable or default to 8080
export PORT=${PORT:-8080}

# Generate Prisma client if needed
npx prisma generate

# Run database migrations if needed
npx prisma migrate deploy

# Start the server
npx ts-node src/server.ts