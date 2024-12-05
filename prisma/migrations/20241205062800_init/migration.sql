-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "status" "ShopStatus" NOT NULL DEFAULT 'ACTIVE';
