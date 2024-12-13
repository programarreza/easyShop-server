/*
  Warnings:

  - You are about to drop the `FlashSales` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FlashSales" DROP CONSTRAINT "FlashSales_productId_fkey";

-- DropForeignKey
ALTER TABLE "FlashSales" DROP CONSTRAINT "FlashSales_vendorId_fkey";

-- DropTable
DROP TABLE "FlashSales";
