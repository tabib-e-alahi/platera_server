/*
  Warnings:

  - You are about to drop the column `customerId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the `customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_customerId_fkey";

-- DropForeignKey
ALTER TABLE "customer" DROP CONSTRAINT "customer_userId_fkey";

-- DropIndex
DROP INDEX "Address_customerId_idx";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "customerId";

-- DropTable
DROP TABLE "customer";
