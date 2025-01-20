/*
  Warnings:

  - The primary key for the `auction_positions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `auction_positions` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `auction_positions` table. All the data in the column will be lost.
  - You are about to drop the column `volumeUnit` on the `auction_positions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `auctions` table. All the data in the column will be lost.
  - Added the required column `productId` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalVolume` to the `auction_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auctionDuration` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gost` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufactureDate` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technicalConditions` to the `auctions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auction_positions" DROP CONSTRAINT "auction_positions_pkey",
DROP COLUMN "name",
DROP COLUMN "volume",
DROP COLUMN "volumeUnit",
ADD COLUMN     "catchAreaId" INTEGER,
ADD COLUMN     "cuttingTypeId" INTEGER,
ADD COLUMN     "processingTypeId" INTEGER,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "sizeId" INTEGER,
ADD COLUMN     "sortId" INTEGER,
ADD COLUMN     "totalVolume" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "auction_positions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "auction_positions_id_seq";

-- AlterTable
ALTER TABLE "auctions" DROP COLUMN "description",
ADD COLUMN     "auctionDuration" INTEGER NOT NULL,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "documentsUrls" TEXT[],
ADD COLUMN     "expirationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gost" BOOLEAN NOT NULL,
ADD COLUMN     "imagesUrls" TEXT[],
ADD COLUMN     "manufactureDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "manufacturer" TEXT NOT NULL,
ADD COLUMN     "technicalConditions" BOOLEAN NOT NULL;
