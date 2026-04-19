/*
  Warnings:

  - You are about to drop the column `deliveryArea` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "deliveryArea",
ADD COLUMN     "deliveryApartment" TEXT,
ADD COLUMN     "deliveryHouseNumber" TEXT;
