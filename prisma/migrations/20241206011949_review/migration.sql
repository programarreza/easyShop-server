-- CreateTable
CREATE TABLE "followed" (
    "customerId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "followed_pkey" PRIMARY KEY ("customerId","shopId")
);

-- AddForeignKey
ALTER TABLE "followed" ADD CONSTRAINT "followed_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followed" ADD CONSTRAINT "followed_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
