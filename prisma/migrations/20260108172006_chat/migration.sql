-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('RIDE', 'SUPPORT', 'ADMIN');

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "rideId" TEXT,
    "riderId" TEXT,
    "driverId" TEXT,
    "adminId" TEXT,
    "type" "ChatType" NOT NULL DEFAULT 'RIDE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "senderUserId" TEXT,
    "senderAdminId" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_rideId_key" ON "Chat"("rideId");

-- CreateIndex
CREATE INDEX "Chat_riderId_driverId_idx" ON "Chat"("riderId", "driverId");

-- CreateIndex
CREATE INDEX "Chat_adminId_idx" ON "Chat"("adminId");

-- CreateIndex
CREATE INDEX "ChatMessage_chatId_createdAt_idx" ON "ChatMessage"("chatId", "createdAt");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderAdminId_fkey" FOREIGN KEY ("senderAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
