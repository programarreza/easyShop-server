/*
  Warnings:

  - Added the required column `grandTotal` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "discountedAmount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "grandTotal" DOUBLE PRECISION NOT NULL;
