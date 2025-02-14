/*
  Warnings:

  - You are about to drop the column `onePieceWeight` on the `auction_positions` table. All the data in the column will be lost.
  - You are about to drop the column `auctionDuration` on the `auctions` table. All the data in the column will be lost.
  - Added the required column `onePieceUnit` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Made the column `endsAt` on table `auctions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "auction_positions" DROP COLUMN "onePieceWeight",
ADD COLUMN     "netWeight" INTEGER,
ADD COLUMN     "onePieceUnit" INTEGER NOT NULL,
ALTER COLUMN "sizeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "auctions" DROP COLUMN "auctionDuration",
ADD COLUMN     "deleteReason" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "endsAt" SET NOT NULL;
