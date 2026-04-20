/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `order_items` table. All the data in the column will be lost.
  - Made the column `mealId` on table `order_items` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_mealId_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "updatedAt",
ALTER COLUMN "mealId" SET NOT NULL;
