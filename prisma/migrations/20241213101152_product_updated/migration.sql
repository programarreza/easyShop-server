-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isFlashSales" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3);
