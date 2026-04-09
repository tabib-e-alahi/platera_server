-- AlterEnum
ALTER TYPE "ApprovalStatus" ADD VALUE 'DRAFT';

-- AlterTable
ALTER TABLE "provider_profile" ALTER COLUMN "approvalStatus" SET DEFAULT 'DRAFT';
