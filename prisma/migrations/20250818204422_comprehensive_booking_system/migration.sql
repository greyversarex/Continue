/*
  Warnings:

  - You are about to drop the column `author_name` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "hotels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT,
    "address" TEXT,
    "rating" REAL,
    "amenities" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tour_hotels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tour_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "price_per_night" REAL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "tour_hotels_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tour_hotels_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "guides" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photo" TEXT,
    "languages" TEXT NOT NULL,
    "contact" TEXT,
    "experience" INTEGER,
    "rating" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tour_guides" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tour_id" INTEGER NOT NULL,
    "guide_id" INTEGER NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "tour_guides_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tour_guides_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_number" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "hotel_id" INTEGER,
    "guide_id" INTEGER,
    "tour_date" TEXT NOT NULL,
    "tourists" TEXT NOT NULL,
    "wishes" TEXT,
    "total_amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_status" TEXT NOT NULL DEFAULT 'unpaid',
    "payment_method" TEXT,
    "receipt_data" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "orders_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "orders_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "orders_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "admins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reviews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "is_moderated" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reviews_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_reviews" ("createdAt", "id", "is_moderated", "rating", "text", "tour_id", "updatedAt") SELECT "createdAt", "id", "is_moderated", "rating", "text", "tour_id", "updatedAt" FROM "reviews";
DROP TABLE "reviews";
ALTER TABLE "new_reviews" RENAME TO "reviews";
CREATE TABLE "new_tours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "format" TEXT,
    "durationDays" INTEGER,
    "theme" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "images" TEXT,
    "services" TEXT,
    "highlights" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tours_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tours" ("categoryId", "city", "country", "createdAt", "description", "duration", "durationDays", "endDate", "format", "id", "price", "startDate", "theme", "title", "updatedAt") SELECT "categoryId", "city", "country", "createdAt", "description", "duration", "durationDays", "endDate", "format", "id", "price", "startDate", "theme", "title", "updatedAt" FROM "tours";
DROP TABLE "tours";
ALTER TABLE "new_tours" RENAME TO "tours";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "tour_hotels_tour_id_hotel_id_key" ON "tour_hotels"("tour_id", "hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "tour_guides_tour_id_guide_id_key" ON "tour_guides"("tour_id", "guide_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
