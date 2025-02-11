/*
  Warnings:

  - You are about to drop the column `comment` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `documents` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `expiration` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `gost` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `manufactureDate` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `technicalConditions` on the `auctions` table. All the data in the column will be lost.
  - Added the required column `expiration` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufactureDate` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `onePieceWeight` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageAddress` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageName` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageTemperature` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storateUnit` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Made the column `cuttingTypeId` on table `auction_positions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `processingTypeId` on table `auction_positions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sizeId` on table `auction_positions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sortId` on table `auction_positions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "auction_positions" ADD COLUMN     "accompanyingDocuments" TEXT[],
ADD COLUMN     "additionalServices" INTEGER[],
ADD COLUMN     "additionalServicesComment" TEXT,
ADD COLUMN     "arrivalDate" TIMESTAMP(3),
ADD COLUMN     "arrivalPort" TEXT,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "documents" TEXT[],
ADD COLUMN     "expiration" INTEGER NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "manufactureDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "manufacturer" TEXT NOT NULL,
ADD COLUMN     "onePieceWeight" INTEGER NOT NULL,
ADD COLUMN     "saleFromShip" BOOLEAN,
ADD COLUMN     "shipName" TEXT,
ADD COLUMN     "storageAddress" TEXT NOT NULL,
ADD COLUMN     "storageName" TEXT NOT NULL,
ADD COLUMN     "storageTemperature" INTEGER NOT NULL,
ADD COLUMN     "storateUnit" "VolumeUnit" NOT NULL,
ALTER COLUMN "cuttingTypeId" SET NOT NULL,
ALTER COLUMN "processingTypeId" SET NOT NULL,
ALTER COLUMN "sizeId" SET NOT NULL,
ALTER COLUMN "sortId" SET NOT NULL;

-- AlterTable
ALTER TABLE "auctions" DROP COLUMN "comment",
DROP COLUMN "documents",
DROP COLUMN "expiration",
DROP COLUMN "gost",
DROP COLUMN "images",
DROP COLUMN "manufactureDate",
DROP COLUMN "manufacturer",
DROP COLUMN "technicalConditions";
