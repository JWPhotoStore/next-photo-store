/*
  Warnings:

  - You are about to drop the column `piID` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `paymentIntentID` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentIntentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `piId` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_piID_fkey";

-- DropIndex
DROP INDEX "Order_paymentIntentID_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "piID",
ADD COLUMN     "piId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentIntentID",
ADD COLUMN     "paymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentIntentId_key" ON "Order"("paymentIntentId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_piId_fkey" FOREIGN KEY ("piId") REFERENCES "Order"("paymentIntentId") ON DELETE RESTRICT ON UPDATE CASCADE;
