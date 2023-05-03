/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_piID_fkey";

-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit_amount" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "piID" TEXT NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_piID_fkey" FOREIGN KEY ("piID") REFERENCES "Order"("paymentIntentID") ON DELETE RESTRICT ON UPDATE CASCADE;
