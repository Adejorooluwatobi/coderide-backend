/*
  Warnings:

  - Added the required column `paymentGateway` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('PAYSTACK', 'FLUTTERWAVE', 'STRIPE');

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "cardFirst6" TEXT,
ADD COLUMN     "paymentGateway" "PaymentGateway" NOT NULL,
ALTER COLUMN "paymentGatewayToken" DROP NOT NULL;
