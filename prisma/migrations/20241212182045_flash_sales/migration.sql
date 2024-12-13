-- CreateTable
CREATE TABLE "FlashSales" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlashSales_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlashSales" ADD CONSTRAINT "FlashSales_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
