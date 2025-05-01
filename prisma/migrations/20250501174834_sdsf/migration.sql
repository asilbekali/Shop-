/*
  Warnings:

  - You are about to drop the column `pictures` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "category" DROP COLUMN "pictures",
ADD COLUMN     "picture" TEXT;
