# Bunyod-Tour Backend API

## Overview
Bunyod-Tour is a comprehensive tourism booking platform for Central Asia, offering tour, hotel, and guide booking, secure payments, and administrative management. It aims to provide a seamless user experience and efficient tools for administrators, supporting multilingual content and diverse payment methods. The project targets significant market potential by modernizing and streamlining regional tourism services.

## User Preferences
Preferred communication style: Simple, everyday language.
Development approach: Improve existing files rather than creating new ones. User prefers enhancement of existing admin-dashboard.html over creation of separate admin panels.
Frontend structure alignment: Admin panel must perfectly match the frontend homepage structure with exact block names and tour organization as shown in provided screenshots.
System integration preference: User requires simplified and unified pricing systems with single source of truth. Eliminated complex manual categorization in favor of automatic detection.

## System Architecture

### Backend Framework
The backend uses **Express.js and TypeScript** with a **modular architecture** following an **MVC pattern**. It supports full CRUD operations, multilingual content (Russian, English), and robust authentication.

### Database Layer
**PostgreSQL with Prisma ORM** is used for data management. The schema includes **Tours**, **Categories**, **TourBlocks**, **TourGuideProfile**, **GuideReview**, **DriverProfile**, **Countries**, and **Cities**, maintaining foreign key relationships.

### Key Features and Systems
-   **Full CRUD Operations**: Implemented for all major entities (tours, hotels, guides, categories, tour-blocks, drivers, countries, cities).
-   **Multilingual Support**: JSON-based content for Russian and English.
-   **Authentication**: Admin, Tour Guide, and Driver login systems are operational.
-   **Component-based Tour Pricing**: Dynamic pricing with inline editing and a unified pricing system with automatic category detection.
-   **Booking & Order System**: Seamless flow from draft bookings to payment-ready orders.
-   **Payment Integration**: AlifPay v2, Stripe, Payme, Click, and PayPal integration with secure transactions and callback handling.
-   **Tour Guide Management System**: Comprehensive profiles, review system, extended tour model with guide assignments, JWT authentication, guide dashboard, and admin integration.
-   **Driver Management System**: Profiles, vehicle categories, license management, multi-language support, JWT authentication, pricing, working areas, file uploads, and integration with tour assignment.
-   **Country and City Management System**: Models for Central Asian countries and cities with multilingual support, admin panel integration, and dynamic form dropdowns.
-   **Admin Panel Transportation Modules**: Fully implemented "Drivers", "Trips", and "Transfers" sections with CRUD functionality, including driver management, tour-driver assignments, and individual transfer bookings.
-   **Currency System**: Supports Chinese Yuan (CNY) with full integration.
-   **API Design**: RESTful endpoints with standardized responses and multilingual content support.
-   **Middleware**: CORS, Express JSON processing, centralized error handling, and request logging.
-   **Type System**: Strong typing enforced via TypeScript and Prisma-generated types.
-   **Email Notification System**: Nodemailer for automated confirmations and notifications.
-   **Internationalization (i18n)**: Supports English and Russian with a language switcher.
-   **Deployment**: Configured for Replit with PostgreSQL, unified server (port 5000), CORS for Replit proxy, and autoscale production environment.

### UI/UX Decisions
-   **Admin Dashboard**: Comprehensive management for tours, orders, hotels, guides, and reviews.
-   **Booking Flow**: A 3-step process for date/hotel selection, tourist information, and payment.
-   **Universal Tour Template System**: Dynamic display of tour info using JSON and URL parameters.
-   **Responsive Design**: Mobile-first approach.
-   **Universal Tab System**: Consistent two-tab structure ("Tour Description" and "Tour Program") for tour pages.
-   **Navigation System**: Comprehensive dropdown navigation with nested sub-menus.
-   **Toggle Filter System**: Modern filter for tours by country, city, type, and category.
-   **Category System**: 15 specific tourism categories.
-   **Banner-Style Tour Types**: Elegant banner presentation for "Виды туров".
-   **Frontend-Aligned Tour Block System**: 6 tour blocks matching frontend structure (e.g., Popular Tours, Recommended Tours).
-   **Static Price Type System**: Database-driven "per person" or "per group" pricing, controlled via admin panel.

## Project Documentation

### Comprehensive Documentation (September 19, 2025)
Created **ИСЧЕРПЫВАЮЩАЯ_ПРОЕКТНАЯ_ДОКУМЕНТАЦИЯ.md** - a maximally detailed documentation covering:

1. **Global Design Document**: Complete color palette with HEX codes, typography (Inter font family), and component structures
2. **Frontend Page Architecture**: Detailed analysis of all 31 HTML files with block structures and interactions
3. **Admin Panel Analysis**: Exhaustive breakdown of every admin section with full field specifications
4. **Business Logic Overview**: Complete workflows from tour creation to booking completion, pricing algorithms, and multilingual implementation

This documentation enables complete project recreation from scratch by any developer.

### Final System Completion and Content Population (September 19, 2025)
**Complete tourism platform implementation with full header/footer standardization and content population:**

- **Footer Map Fix**: Resolved inline script execution issue by moving map initialization from `_footer.html` to `frontend/public/js/layout-loader.js`. OpenStreetMap iframe now loads consistently via programmatic injection.
- **Database Content Population**: Successfully seeded complete tourism content:
  - ✅ **13 tours** across Central Asia (Tajikistan, Uzbekistan, Kyrgyzstan, Kazakhstan, Turkmenistan)
  - ✅ **6 tour blocks** with proper country-based organization
  - ✅ **18 tour-block assignments** linking tours to appropriate categories
  - ✅ **3 attractive slides** for homepage carousel (Pamir Highway, Samarkand, Kyrgyzstan Trek)
  - ✅ **4 hotels + 4 guides + 4 categories** for complete booking ecosystem
- **Content Integration**: All APIs returning live data - no more "default content" or "No slides found" messages
- **System Verification**: Server logs confirm all components working: tour blocks finding tours (3/3/6/3/2/1 distribution), slides loading, footer map rendering successfully

### Language System Migration (September 19, 2025)
Successfully completed migration from trilingual (EN/RU/TJ) to bilingual (EN/RU) system:

- **Admin Forms**: Removed all Tajik language fields from tour, hotel, news, country, city, and content management forms
- **Backend Controllers**: Updated all controllers to remove `nameTj` field processing
- **Database Schema**: Removed `nameTj` fields from Prisma models (Country, City) and synchronized with database
- **Type System**: Updated MultilingualContent interface to support only EN/RU languages
- **Result**: System fully operational in bilingual mode with successful backend compilation and zero LSP errors

## External Dependencies

### Core Framework Dependencies
-   **Express.js**: Web application framework.
-   **Prisma Client**: Database ORM.
-   **CORS**: Cross-origin resource sharing.
-   **Nodemailer**: Email sending.
-   **Stripe API**: Payment processing.
-   **Payme API**: Local payment gateway.
-   **Click API**: Local payment gateway.
-   **PayPal API**: International payment gateway.
-   **AlifPay API v2**: Payment gateway.

### Development Tools
-   **TypeScript**: Static type checking.

### Database
-   **PostgreSQL**: Relational database.
-   **Prisma ORM**: Database management and migrations.