/*
  Warnings:

  - You are about to drop the `Chatroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatroomUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AuctionType" AS ENUM ('REGULAR', 'COLLECTIVE');

-- CreateEnum
CREATE TYPE "VolumeUnit" AS ENUM ('KG', 'TON');

-- DropForeignKey
ALTER TABLE "ChatroomUsers" DROP CONSTRAINT "ChatroomUsers_chatroomId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatroomId_fkey";

-- DropTable
DROP TABLE "Chatroom";

-- DropTable
DROP TABLE "ChatroomUsers";

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "auctions" (
    "id" TEXT NOT NULL,
    "type" "AuctionType" NOT NULL DEFAULT 'REGULAR',
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "initialPrice" INTEGER NOT NULL DEFAULT 0,
    "stepPrice" INTEGER NOT NULL DEFAULT 0,
    "buyoutPrice" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT,
    "chatroomId" INTEGER NOT NULL,

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_positions" (
    "id" SERIAL NOT NULL,
    "auctionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "volume" INTEGER NOT NULL,
    "volumeUnit" "VolumeUnit" NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auction_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_participants" (
    "id" SERIAL NOT NULL,
    "auctionId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auction_participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auction_positions" ADD CONSTRAINT "auction_positions_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_participants" ADD CONSTRAINT "auction_participants_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
