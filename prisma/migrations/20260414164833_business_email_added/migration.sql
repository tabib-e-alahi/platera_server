/*
  Warnings:

  - A unique constraint covering the columns `[businessEmail]` on the table `provider_profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessEmail` to the `provider_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "provider_profile" ADD COLUMN     "businessEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "provider_profile_businessEmail_key" ON "provider_profile"("businessEmail");
