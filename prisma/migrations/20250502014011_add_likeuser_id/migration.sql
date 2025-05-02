/*
  Warnings:

  - Added the required column `userId` to the `like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "like" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
