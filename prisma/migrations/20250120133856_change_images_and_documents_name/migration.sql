/*
  Warnings:

  - You are about to drop the column `documentsUrls` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `imagesUrls` on the `auctions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auctions" DROP COLUMN "documentsUrls",
DROP COLUMN "imagesUrls",
ADD COLUMN     "documents" TEXT[],
ADD COLUMN     "images" TEXT[];
