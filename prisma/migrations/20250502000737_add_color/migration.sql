/*
  Warnings:

  - Made the column `picture` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product" ALTER COLUMN "picture" SET NOT NULL;
