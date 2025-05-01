/*
  Warnings:

  - The values [soldOut] on the enum `productStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `view` on the `product` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "productStatus_new" AS ENUM ('active', 'pending', 'offline');
ALTER TABLE "product" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "product" ALTER COLUMN "status" TYPE "productStatus_new" USING ("status"::text::"productStatus_new");
ALTER TYPE "productStatus" RENAME TO "productStatus_old";
ALTER TYPE "productStatus_new" RENAME TO "productStatus";
DROP TYPE "productStatus_old";
ALTER TABLE "product" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- DropIndex
DROP INDEX "user_email_idx";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "view";

-- CreateTable
CREATE TABLE "view" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "view_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "view" ADD CONSTRAINT "view_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "view" ADD CONSTRAINT "view_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
