/*
  Warnings:

  - Made the column `phone` on table `customer_profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streetAddress` on table `customer_profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customer_profiles" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "streetAddress" SET NOT NULL;
