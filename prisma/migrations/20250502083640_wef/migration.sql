/*
  Warnings:

  - You are about to drop the column `messageId` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_messageId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_fromId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_toId_fkey";

-- AlterTable
ALTER TABLE "chat" DROP COLUMN "messageId";

-- DropTable
DROP TABLE "message";

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
