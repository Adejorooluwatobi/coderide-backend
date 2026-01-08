-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED', 'BANNED');

-- DropForeignKey
ALTER TABLE "PaymentMethod" DROP CONSTRAINT "PaymentMethod_id_fkey";

-- DropIndex
DROP INDEX "Earning_driverId_idx";

-- DropIndex
DROP INDEX "Earning_payoutStatus_idx";

-- DropIndex
DROP INDEX "Notification_expiresAt_idx";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- DropIndex
DROP INDEX "Notification_userId_isRead_idx";

-- DropIndex
DROP INDEX "Ride_driverId_idx";

-- DropIndex
DROP INDEX "Ride_requestedAt_idx";

-- DropIndex
DROP INDEX "Ride_riderId_idx";

-- DropIndex
DROP INDEX "Ride_status_idx";

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "status" "DriverStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Earning" ADD COLUMN     "payoutId" TEXT;

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "transferReference" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payout_transferReference_key" ON "Payout"("transferReference");

-- CreateIndex
CREATE INDEX "Payout_driverId_idx" ON "Payout"("driverId");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "Payout"("status");

-- CreateIndex
CREATE INDEX "Driver_isOnline_idx" ON "Driver"("isOnline");

-- CreateIndex
CREATE INDEX "Driver_documentStatus_idx" ON "Driver"("documentStatus");

-- CreateIndex
CREATE INDEX "Driver_status_idx" ON "Driver"("status");

-- CreateIndex
CREATE INDEX "Earning_driverId_payoutStatus_idx" ON "Earning"("driverId", "payoutStatus");

-- CreateIndex
CREATE INDEX "Earning_createdAt_payoutStatus_idx" ON "Earning"("createdAt", "payoutStatus");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Ride_status_riderId_idx" ON "Ride"("status", "riderId");

-- CreateIndex
CREATE INDEX "Ride_status_driverId_idx" ON "Ride"("status", "driverId");

-- CreateIndex
CREATE INDEX "Ride_requestedAt_status_idx" ON "Ride"("requestedAt", "status");

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_defaultPaymentMethodId_fkey" FOREIGN KEY ("defaultPaymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Earning" ADD CONSTRAINT "Earning_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "Payout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
