-- CreateEnum
CREATE TYPE "ProviderSettlementStatus" AS ENUM ('PENDING', 'PAID');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "providerSettledAt" TIMESTAMP(3),
ADD COLUMN     "providerSettledBy" TEXT,
ADD COLUMN     "providerSettlementNote" TEXT,
ADD COLUMN     "providerSettlementStatus" "ProviderSettlementStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "payments_providerSettlementStatus_idx" ON "payments"("providerSettlementStatus");
