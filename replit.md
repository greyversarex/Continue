# Bunyod-Tour Backend API

## Overview

A comprehensive tourism booking platform for Central Asia featuring complete tour booking system, hotel and guide selection, payment processing, and administrative management. The platform includes a TypeScript Express backend API with SQLite database, React frontend components, and a full-featured admin dashboard. Supports multilingual content (English/Russian), automated email notifications, and integration with multiple payment systems (Payme, Click, Stripe, PayPal). Built following modern web development practices with type safety, RESTful API design, and responsive UI components.

## Recent Changes (August 2025)

- **Complete Tourism Booking Platform**: Built comprehensive booking system according to technical specifications
- **Full CRUD Operations**: Complete Create, Read, Update, Delete functionality for tours, hotels, guides, categories
- **3-Step Booking Process**: Hotel selection → Customer details → Payment integration
- **Database Expansion**: Added Hotel, Guide, BookingRequest, Review, and Customer models with relationships
- **Admin Dashboard**: Complete admin panel with tour management, booking oversight, and review moderation
- **API Architecture**: 20+ endpoints covering tours, hotels, guides, bookings, reviews, categories
- **Hotel & Guide System**: 4 hotels and 4 guides in database with multilingual support
- **Payment Integration**: Support for Payme, Click, Stripe, and PayPal payment methods
- **Email Notifications**: Working automated booking confirmations to customers and administrators
- **Booking Flow Validation**: Multi-step form validation with participant management and special requests
- **Review System**: Customer review submission with admin moderation capabilities
- **Test Interface**: Created booking-test.html for comprehensive system testing
- **Internationalization (i18n)**: Added trilingual support (English/Russian/Tajik) using react-i18next with language switcher component
- **Universal Tour Template System**: Created comprehensive tour page template (tour-template.html) with dynamic JSON data loading, URL parameter support, and advanced interactive features including image galleries, social sharing, wishlist functionality, and booking system simulation
- **Footer Integration**: Added complete footer from main page to tour pages with updated social media links (Facebook, Instagram, YouTube, WhatsApp, Telegram)
- **Accordion Layout Update**: Changed accordion buttons from vertical stacking to horizontal grid layout (4 columns) for better visual hierarchy
- **Services Section**: Added new services block with 4 service cards featuring icon-based design: Transfer, Guide, Agency Service, and Master Class
- **Tour Page Layout Fixes**: Restructured tour template with proper Viator-style layout, sticky booking sidebar, and compact horizontal info strip
- **Single Date Picker**: Replaced date range selection with single HTML5 date picker with calendar interface for improved user experience
- **Fundamental Tab System Implementation**: Made tabbed tour information format mandatory and universal across ALL tour-related files, establishing it as the core architectural pattern for tour content presentation
- **Dark Gray Filter Implementation**: Successfully changed filter gradient to elegant dark gray (#4A4A4A → #3E3E3E → #2F2F2F) and resolved Replit preview caching issues using cache-busting techniques
- **Navigation System Overhaul**: Implemented comprehensive dropdown navigation with 6 main sections (О нас, Услуги, Туристам, Акции, Новости, Турагентам) featuring nested sub-menus for Услуги (Тургиды/Трансфер with 3 sub-items each) and multi-level structure
- **Modern Toggle Filter System**: Replaced compact horizontal layout with elegant toggle-based filter system featuring white buttons with shadow effects, clean filter panel without background container, and professional color scheme maintaining all filter functionality (country, city, tour type, category, date)
- **Updated Category System**: Renamed "Тематика" to "Категории" with 13 specific tourism categories, changed "Формат тура" to "Вид тура" with 4 tour types (Персональный, Групповой персональный, Групповой общий, VIP), removed duration filter
- **Complete Category Overhaul (August 2025)**: Replaced tour categories with comprehensive 13-category system: Городские туры, Природа/экологические туры, Культурно познавательные туры, Исторические туры, Походы/трекинги, Горные ландшафты, Озерные ландшафты, Приключенческие туры, Гастрономические туры, Автотуры/сафари/джип-туры, Агротуры, VIP туры, MICE/корпоративные туры
- **Simplified Category Display**: Updated category cards to show only tour name and description (removed ratings, prices, locations for cleaner presentation)
- **Horizontal Scrolling with Standard Cards**: Implemented horizontal scrolling layout for category cards with standard card proportions (288px width) maintaining proper aspect ratios without stretching
- **Banner-Style Tour Types Section**: Redesigned "Виды туров" from card-based layout to elegant banner-style presentation with inline sections (Персональный, Групповой персональный, Групповой общий, VIP) removing icons for cleaner appearance
- **Tour Information Simplification**: Removed hotel information content blocks from all tour page templates, streamlining information display to focus on tour description and program only
- **Multilingual Header Integration**: Added 4-language selector (English, Русский, Таджикский, Фарси) to header navigation for international accessibility
- **Deployment Configuration (August 2025)**: Comprehensive deployment fixes including: updated deployment.toml run command to use start.sh script, configured port 80 for autoscale deployments, updated server.ts to properly handle environment PORT variables, added proper CORS origins for Replit deployment URLs, ensured health checks work correctly with /api/health endpoint, and created production-ready startup scripts with database migrations

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

## Frontend Tour Template System

### Universal Tour Template Architecture
- **Single Template, Multiple Tours**: Created tour-template.html as a universal template that can display any tour using JSON data
- **Dynamic Data Loading**: Supports URL parameters (?tour=tourkey) to load different tour datasets
- **Sample Data Management**: Comprehensive sample-tour-data.js with multiple tour examples across Central Asian countries

### Advanced Interactive Features
- **Image Gallery with Lightbox**: Full-screen image modal with keyboard navigation (arrows, escape) and click-through functionality
- **Booking Simulation**: Interactive booking panel with date selection, participant counting, price calculation, and availability checking
- **Social Features**: Share functionality (Web Share API with clipboard fallback) and wishlist toggle with visual feedback
- **Responsive Design**: Mobile-first approach with sticky sidebar booking panel and adaptive image gallery
- **Review System**: Expandable reviews with avatar generation and load-more functionality

### Production-Ready Scalability
- **URL-Based Tour Loading**: Each tour can have its own URL (tour-template.html?tour=pamir_highway)
- **JSON Data Structure**: Standardized tour data format supporting images, pricing, reviews, highlights, and related tours
- **Cross-Device Compatibility**: Fully responsive design tested across different screen sizes
- **SEO-Friendly**: Dynamic title updates and semantic HTML structure

### Universal Tab System Architecture (August 2025)
- **Streamlined Two-Tab Structure**: All tour pages now implement standardized tabbed information display
  - "Описание тура" (Tour Description): Overview, highlights, and key features
  - "Программа тура" (Tour Program): Time-based schedule with activity details
- **Simplified Tour Information**: Removed "Отели" tab from all tour pages to streamline information display
- **Implementation Coverage**: 100% of tour files include tab system
  - Static pages: tour-fixed.html, tour-page-correct.html, tour-template.html, tour-template-viator.html
  - Demo page: tour-examples.html (with demonstration tabs)
  - Search interface: tours.html (modal-based detailed view with tabs)
- **Consistent JavaScript Functionality**: Uniform switchTab() functions across all implementations
- **User Experience**: Intuitive navigation with visual active state indicators and hover effects