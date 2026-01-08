-- CreateEnum
CREATE TYPE "RiderStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "status" "AdminStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN     "status" "RiderStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "Admin_status_idx" ON "Admin"("status");

-- CreateIndex
CREATE INDEX "Rider_status_idx" ON "Rider"("status");
