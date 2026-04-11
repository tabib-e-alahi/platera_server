-- CreateEnum
CREATE TYPE "DietaryPreference" AS ENUM ('VEGAN', 'VEGETARIAN', 'HALAL', 'GLUTEN_FREE', 'DAIRY_FREE', 'NUT_FREE');

-- AlterTable
ALTER TABLE "provider_profile" ALTER COLUMN "approvalStatus" SET DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageURL" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subcategory" TEXT,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT,
    "portionSize" TEXT,
    "mainImageURL" TEXT NOT NULL,
    "galleryImageURLs" TEXT[],
    "basePrice" INTEGER NOT NULL,
    "discountPrice" INTEGER,
    "dietaryPreferences" "DietaryPreference"[],
    "allergens" TEXT[],
    "calories" INTEGER,
    "protein" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "carbohydrates" DOUBLE PRECISION,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "preparationTimeMinutes" INTEGER NOT NULL DEFAULT 15,
    "isBestseller" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "deliveryFee" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_size" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extraPrice" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "meal_size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_spice_level" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "meal_spice_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_add_on" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "meal_add_on_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_remove_option" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "meal_remove_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_ingredient" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "meal_ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE INDEX "category_slug_idx" ON "category"("slug");

-- CreateIndex
CREATE INDEX "meal_providerId_idx" ON "meal"("providerId");

-- CreateIndex
CREATE INDEX "meal_categoryId_idx" ON "meal"("categoryId");

-- CreateIndex
CREATE INDEX "meal_isAvailable_isActive_idx" ON "meal"("isAvailable", "isActive");

-- CreateIndex
CREATE INDEX "meal_size_mealId_idx" ON "meal_size"("mealId");

-- CreateIndex
CREATE INDEX "meal_spice_level_mealId_idx" ON "meal_spice_level"("mealId");

-- CreateIndex
CREATE INDEX "meal_add_on_mealId_idx" ON "meal_add_on"("mealId");

-- CreateIndex
CREATE INDEX "meal_remove_option_mealId_idx" ON "meal_remove_option"("mealId");

-- CreateIndex
CREATE INDEX "meal_ingredient_mealId_idx" ON "meal_ingredient"("mealId");

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_size" ADD CONSTRAINT "meal_size_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_spice_level" ADD CONSTRAINT "meal_spice_level_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_add_on" ADD CONSTRAINT "meal_add_on_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_remove_option" ADD CONSTRAINT "meal_remove_option_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_ingredient" ADD CONSTRAINT "meal_ingredient_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
