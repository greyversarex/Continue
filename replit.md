# Tajik Trails Backend API

## Overview

A complete TypeScript Express backend API for Tajik Trails tour agency specializing in Tajikistan tourism. The system provides multilingual tour and category management with support for English and Russian content, along with booking request handling and review management with moderation capabilities. Built with modern web technologies including Express.js, Prisma ORM, and SQLite database, the API follows RESTful design principles and emphasizes type safety throughout the codebase.

## Recent Changes (August 2025)

- **Complete CRUD Operations**: Added full Create, Read, Update, Delete functionality for tours and categories
- **Booking Request System**: Implemented customer booking request handling with tour validation
- **Review System**: Added review submission with rating validation and admin moderation capabilities  
- **Database Schema Expansion**: Added BookingRequest and Review models with proper relationships
- **Enhanced API Endpoints**: Expanded from 3 to 12 endpoints covering all business requirements
- **Data Validation**: Comprehensive validation for all input fields including multilingual content
- **Admin vs Public Endpoints**: Proper separation of admin management and public user functionality
- **Email Notifications**: Integrated Nodemailer for automated booking confirmations and admin notifications
- **Internationalization (i18n)**: Added trilingual support (English/Russian/Tajik) using react-i18next with language switcher component

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Framework
- **Express.js with TypeScript**: Chosen for type safety, developer productivity, and robust ecosystem support
- **Modular Architecture**: Organized into controllers, models, routes, and middleware layers for clear separation of concerns
- **MVC Pattern**: Controllers handle business logic, models manage data access, and routes define API endpoints

### Database Layer
- **SQLite with Prisma ORM**: SQLite provides simplicity for development and deployment, while Prisma offers type-safe database access and excellent TypeScript integration
- **Schema Design**: 
  - Tours table with multilingual JSON fields for title/description
  - Categories table for tour classification
  - Foreign key relationship between tours and categories
- **Database Connection Management**: Global Prisma client instance with graceful shutdown handling

### API Design
- **RESTful Endpoints**: Standard HTTP methods (GET, POST) for resource management
- **Multilingual Support**: JSON-based storage for English and Russian content in database fields
- **Response Format**: Standardized API response structure with success/error states and consistent data formatting

### Middleware Stack
- **CORS Configuration**: Configured for React frontend compatibility with credential support
- **JSON Processing**: Built-in Express JSON parsing with 10MB limit
- **Error Handling**: Centralized error middleware with Prisma-specific error handling and development-friendly error responses
- **Request Logging**: Development-mode request logging for debugging

### Type System
- **Strong Typing**: Comprehensive TypeScript interfaces for multilingual content, tour data, categories, and API responses
- **Type Safety**: End-to-end type safety from database to API responses using Prisma-generated types

### Development Environment
- **Hot Reload**: Nodemon integration for development productivity
- **Build Process**: TypeScript compilation with source maps and declaration files
- **Code Organization**: Path aliases for clean imports and modular file structure

## External Dependencies

### Core Framework Dependencies
- **Express.js**: Web application framework for Node.js
- **Prisma Client**: Database ORM and client for type-safe database operations
- **CORS**: Cross-origin resource sharing middleware for frontend integration

### Development Tools
- **TypeScript**: Static type checking and modern JavaScript features
- **ts-node**: TypeScript execution environment for Node.js
- **Nodemon**: Development server with automatic restart functionality

### Database
- **SQLite**: Embedded SQL database engine (managed through Prisma)
- **Prisma ORM**: Database toolkit providing type-safe client, migrations, and schema management

### Type Definitions
- **@types/express**: TypeScript definitions for Express.js
- **@types/cors**: TypeScript definitions for CORS middleware
- **@types/node**: TypeScript definitions for Node.js runtime