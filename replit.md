# Bunyod-Tour Backend API

## Overview

Bunyod-Tour is a comprehensive tourism booking platform focused on Central Asia. It provides a complete system for tour booking, hotel and guide selection, secure payment processing, and administrative management. The platform aims to offer a seamless booking experience for users and efficient management tools for administrators, supporting multilingual content and various payment methods. The project envisions significant market potential by streamlining tourism services in the region, contributing to a modern and accessible travel industry.

## User Preferences

Preferred communication style: Simple, everyday language.
Development approach: Improve existing files rather than creating new ones. User prefers enhancement of existing admin-dashboard.html over creation of separate admin panels.
Frontend structure alignment: Admin panel must perfectly match the frontend homepage structure with exact block names and tour organization as shown in provided screenshots.

## System Architecture

### Backend Framework
The backend is built with **Express.js and TypeScript**, chosen for type safety, developer productivity, and robust ecosystem support. It follows a **modular architecture** organized into controllers, models, routes, and middleware, adhering to an **MVC pattern** for clear separation of concerns.

### System Status (Updated September 5, 2025)
- **✅ Full CRUD Operations**: All create, read, update, delete operations tested and working
- **✅ Multilingual Support**: JSON-based multilingual content properly implemented (Russian, English, Tajik)
- **✅ Database Integration**: PostgreSQL with Prisma ORM fully operational
- **✅ API Endpoints**: All major endpoints (tours, hotels, guides, categories, tour-blocks, drivers) functioning
- **✅ Authentication**: Admin login working on both Backend API (port 3001) and Unified Server (port 3000)
- **✅ Data Validation**: Fixed critical duration field conversion issue (integer to string for Prisma)
- **✅ Content Created**: 32 tours, 6 hotels, 5 guides, 7 categories, 6 tour blocks, 1 driver successfully created
- **✅ Component-based Tour Pricing**: Dynamic pricing system with inline editing implemented
- **✅ Booking-to-Order Data Flow**: Fixed critical integration between Booking (draft) and Order (payment-ready) systems
- **✅ Payment Integration**: Seamless connection between booking system and AlifPay/Payler payment gateways with proper orderNumber generation
- **✅ Tour Guide Cabinet System**: Fully operational with real-time tour management, status updates, and tourist tracking. All demo data replaced with live API integration.
- **✅ Driver Management System**: Complete driver management system with authentication, vehicle categories, and admin panel integration successfully implemented and tested.

### Database Layer
**PostgreSQL with Prisma ORM** is used for the database. PostgreSQL provides robust relational database features with excellent scalability, while Prisma provides type-safe database access and excellent TypeScript integration. The schema includes **Tours** with multilingual JSON fields, **Categories** for classification, **TourBlocks** for frontend organization, and new **TourGuideProfile** and **GuideReview** models for tour guide management, maintaining foreign key relationships. The database contains tours organized into blocks matching the frontend structure. A global Prisma client instance manages database connections with graceful shutdown.

### Tour Guide Management System
A comprehensive **tour guide cabinet system** has been implemented with the following components:
- **TourGuideProfile**: Complete guide profiles with authentication, contact information, specializations, and performance metrics
- **GuideReview**: Review system for tour guides with ratings and feedback from tourists
- **Extended Tour Model**: Tours now include guide assignments, status tracking, unique codes, and scheduled dates
- **Authentication System**: JWT-based authentication specifically for tour guides with middleware protection
- **Guide Dashboard**: Personal dashboard for tour guides to view assignments, manage tour status, and track performance
- **Admin Integration**: Tour history management interface for administrators to assign guides and track tour progress

### Driver Management System
A complete **driver management system** has been developed parallel to the tour guide system with the following features:
- **Driver Profile Model**: Comprehensive driver profiles with personal information, contact details, experience, and vehicle specializations
- **Vehicle Type Categories**: Support for multiple vehicle types including sedan, SUV, minibus, bus, truck, motorcycle, and taxi options
- **License Management**: Driver license categories (A, B, C, D, E, BE, CE, DE) with license number tracking
- **Multi-language Support**: Driver language capabilities for international tourists
- **JWT Authentication**: Secure driver authentication system with encrypted passwords and session management
- **Pricing System**: Flexible hourly and daily pricing rates in TJS currency with automatic conversion capabilities
- **Working Areas**: Geographic coverage specification for driver availability zones
- **File Upload System**: Avatar and document upload functionality with validation and storage
- **Admin Panel Integration**: Complete admin interface for driver CRUD operations within the existing dashboard
- **API Endpoints**: Full RESTful API with create, read, update, delete, and authentication endpoints
- **Login Interface**: Dedicated driver login page with responsive design and error handling

### API Design
The API implements **RESTful endpoints** using standard HTTP methods. It supports **multilingual content** stored as JSON in database fields. API responses follow a standardized structure with success/error states and consistent data formatting.

### Middleware Stack
The middleware stack includes **CORS configuration** for React frontend compatibility, built-in Express **JSON processing** (10MB limit), a centralized **error handling** middleware with Prisma-specific error handling, and **request logging** for development.

### Type System
**Strong typing** is enforced using comprehensive TypeScript interfaces for multilingual content, tour data, categories, and API responses, ensuring end-to-end type safety with Prisma-generated types.

### UI/UX Decisions
The platform features a **comprehensive Admin Dashboard** for managing tours, orders, hotels, guides, and reviews. The **booking flow is a 3-step process** for date/hotel selection, tourist information, and payment. Key UI/UX elements include:
- **Universal Tour Template System**: A single HTML template dynamically displays tour information using JSON data, supporting URL parameters for different tours.
- **Image Gallery with Lightbox**: Provides an interactive image viewing experience.
- **Responsive Design**: A mobile-first approach ensuring usability across various devices.
- **Universal Tab System**: All tour pages consistently use a two-tab structure ("Tour Description" and "Tour Program") for streamlined information display.
- **Navigation System Overhaul**: Implemented comprehensive dropdown navigation with nested sub-menus.
- **Modern Toggle Filter System**: An elegant filter system for tours, supporting country, city, tour type, and category filtering.
- **Category System**: Features 15 specific tourism categories including Day Tours, Multi-day Tours, Excursions, City Tours, Nature/Eco Tours, Cultural Educational Tours, Historical Tours, Hiking/Trekking, Mountain Landscapes, Lake Landscapes, Adventure Tours, Gastronomic Tours, Auto Tours/Safari/Jeep Tours, Agro Tours, and VIP Tours.
- **Banner-Style Tour Types Section**: Redesigned "Виды туров" (Tour Types) into an elegant banner presentation.
- **Frontend-Aligned Tour Block System**: Implemented 6 tour blocks matching exact frontend structure: Популярные туры, Рекомендованные туры по Центральной Азии, Туры по Таджикистану, Туры по Узбекистану, Туры по Киргизстану, Туры по Туркменистану.
- **Static Price Type System**: Replaced frontend price toggles with database-driven static price type display. Admin panel now controls whether tour pricing is "за человека" or "за группу" during tour creation, eliminating frontend toggle complexity.

### Technical Implementations
- **Payment System**: Integrated with Stripe, Payme, Click, and PayPal, handling payment intents, confirmations, and refunds, with webhook support.
- **Email Notification System**: Uses Nodemailer for automated booking confirmations, payment confirmations, cancellations, and admin notifications with HTML templates.
- **Internationalization (i18n)**: Supports English, Russian, and Tajik languages with a language switcher component.
- **Deployment Configuration**: Includes `start.sh` for production, port 80 configuration, CORS origin handling for Replit, and health checks.

## External Dependencies

### Core Framework Dependencies
- **Express.js**: Web application framework.
- **Prisma Client**: Database ORM for type-safe operations.
- **CORS**: Middleware for cross-origin resource sharing.
- **Nodemailer**: Module for email sending.
- **Stripe API**: For payment processing.
- **Payme API**: For local payment gateway integration.
- **Click API**: For local payment gateway integration.
- **PayPal API**: For international payment gateway integration.

### Development Tools
- **TypeScript**: For static type checking.
- **ts-node**: TypeScript execution environment.
- **Nodemon**: For automatic server restarts during development.

### Database
- **SQLite**: Embedded SQL database engine.
- **Prisma ORM**: For database management and schema migrations.

### Type Definitions
- **@types/express**: TypeScript definitions for Express.js.
- **@types/cors**: TypeScript definitions for CORS middleware.
- **@types/node**: TypeScript definitions for Node.js runtime.