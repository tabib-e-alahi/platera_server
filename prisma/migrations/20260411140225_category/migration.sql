/*
  Warnings:

  - Made the column `imageURL` on table `category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "category" ALTER COLUMN "imageURL" SET NOT NULL;
