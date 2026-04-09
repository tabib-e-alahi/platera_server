-- CreateEnum
CREATE TYPE "BusinessCategory" AS ENUM ('RESTAURANT', 'SHOP', 'HOME_KITCHEN', 'STREET_FOOD');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "provider_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessCategory" "BusinessCategory" NOT NULL,
    "phone" TEXT NOT NULL,
    "bio" TEXT,
    "imageURL" TEXT,
    "binNumber" TEXT,
    "binVerified" BOOLEAN NOT NULL DEFAULT false,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "apartment" TEXT,
    "postalCode" TEXT NOT NULL,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provider_profile_userId_key" ON "provider_profile"("userId");

-- CreateIndex
CREATE INDEX "provider_profile_userId_idx" ON "provider_profile"("userId");

-- CreateIndex
CREATE INDEX "provider_profile_city_idx" ON "provider_profile"("city");

-- CreateIndex
CREATE INDEX "provider_profile_approvalStatus_idx" ON "provider_profile"("approvalStatus");

-- AddForeignKey
ALTER TABLE "provider_profile" ADD CONSTRAINT "provider_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
