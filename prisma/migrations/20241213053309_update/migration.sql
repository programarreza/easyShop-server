/*
  Warnings:

  - Added the required column `vendorId` to the `FlashSales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FlashSales" ADD COLUMN     "vendorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FlashSales" ADD CONSTRAINT "FlashSales_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
