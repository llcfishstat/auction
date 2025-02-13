/*
  Warnings:

  - A unique constraint covering the columns `[serial_number]` on the table `auctions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serial_number` to the `auctions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "serial_number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "auctions_serial_number_key" ON "auctions"("serial_number");
