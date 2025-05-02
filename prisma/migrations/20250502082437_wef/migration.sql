/*
  Warnings:

  - Added the required column `chatemessage` to the `chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageId` to the `chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chat" ADD COLUMN     "chatemessage" TEXT NOT NULL,
ADD COLUMN     "messageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
