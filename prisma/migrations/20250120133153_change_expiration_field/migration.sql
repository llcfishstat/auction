/*
  Warnings:

  - You are about to drop the column `expirationDate` on the `auctions` table. All the data in the column will be lost.
  - Added the required column `expiration` to the `auctions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auctions" DROP COLUMN "expirationDate",
ADD COLUMN     "expiration" INTEGER NOT NULL;
