/*
  Warnings:

  - A unique constraint covering the columns `[userId,orderId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "orderId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "reviews_providerId_idx" ON "reviews"("providerId");

-- CreateIndex
CREATE INDEX "reviews_mealId_idx" ON "reviews"("mealId");

-- CreateIndex
CREATE INDEX "reviews_orderId_idx" ON "reviews"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_orderId_key" ON "reviews"("userId", "orderId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
