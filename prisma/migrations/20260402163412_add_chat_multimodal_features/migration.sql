-- CreateEnum
CREATE TYPE "ChatMessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'VOICE_NOTE', 'CALL_START', 'CALL_END', 'MISSED_CALL');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "activeCallId" TEXT,
ADD COLUMN     "activeCallStartedAt" TIMESTAMP(3),
ADD COLUMN     "lastMessageAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "isDelivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "type" "ChatMessageType" NOT NULL DEFAULT 'TEXT',
ALTER COLUMN "message" DROP NOT NULL;
