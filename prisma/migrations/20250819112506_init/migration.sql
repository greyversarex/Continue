-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tour_blocks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tours" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" TEXT,
    "duration" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "priceType" TEXT NOT NULL DEFAULT 'за человека',
    "originalPrice" TEXT,
    "country" TEXT,
    "city" TEXT,
    "format" TEXT,
    "durationDays" INTEGER,
    "theme" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "images" TEXT,
    "mainImage" TEXT,
    "services" TEXT,
    "highlights" TEXT,
    "itinerary" TEXT,
    "included" TEXT,
    "excluded" TEXT,
    "requirements" TEXT,
    "difficulty" TEXT,
    "rating" DOUBLE PRECISION,
    "reviewsCount" INTEGER,
    "maxPeople" INTEGER,
    "minPeople" INTEGER,
    "location" TEXT,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER NOT NULL,
    "tour_block_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hotels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT,
    "address" TEXT,
    "rating" DOUBLE PRECISION,
    "amenities" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tour_hotels" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "price_per_night" DOUBLE PRECISION,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tour_hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guides" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photo" TEXT,
    "languages" TEXT NOT NULL,
    "contact" TEXT,
    "experience" INTEGER,
    "rating" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tour_guides" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "guide_id" INTEGER NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tour_guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customers" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "order_number" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "hotel_id" INTEGER,
    "guide_id" INTEGER,
    "tour_date" TEXT NOT NULL,
    "tourists" TEXT NOT NULL,
    "wishes" TEXT,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_status" TEXT NOT NULL DEFAULT 'unpaid',
    "payment_method" TEXT,
    "payment_intent_id" TEXT,
    "receipt_data" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."booking_requests" (
    "id" SERIAL NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "preferred_date" TEXT NOT NULL,
    "number_of_people" INTEGER NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "is_moderated" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admins" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_blocks" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."site_settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pages" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "template" TEXT NOT NULL DEFAULT 'default',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu_items" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."news_posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tour_blocks_slug_key" ON "public"."tour_blocks"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tour_hotels_tour_id_hotel_id_key" ON "public"."tour_hotels"("tour_id", "hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "tour_guides_tour_id_guide_id_key" ON "public"."tour_guides"("tour_id", "guide_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "public"."customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "public"."orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "public"."admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "public"."admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "content_blocks_key_key" ON "public"."content_blocks"("key");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "public"."site_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "public"."pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "news_posts_slug_key" ON "public"."news_posts"("slug");

-- AddForeignKey
ALTER TABLE "public"."tours" ADD CONSTRAINT "tours_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tours" ADD CONSTRAINT "tours_tour_block_id_fkey" FOREIGN KEY ("tour_block_id") REFERENCES "public"."tour_blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tour_hotels" ADD CONSTRAINT "tour_hotels_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tour_hotels" ADD CONSTRAINT "tour_hotels_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tour_guides" ADD CONSTRAINT "tour_guides_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tour_guides" ADD CONSTRAINT "tour_guides_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_requests" ADD CONSTRAINT "booking_requests_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_items" ADD CONSTRAINT "menu_items_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
