import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/common/services/prisma.service';
import { AuctionType, Prisma } from '@prisma/client';

import {
  AuctionCreateDto,
  AuctionCreatePositionDto,
} from 'src/modules/auction/dtos/auction-create.dto';
import { AuctionUpdateDto } from 'src/modules/auction/dtos/auction-update.dto';

@Injectable()
export class AuctionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {
    this.authClient.connect();
  }

  async createAuction(dto: AuctionCreateDto) {
    const createdAuction = await this.prisma.auction.create({
      data: {
        type: dto.type,
        title: dto.title,
        initialPrice: dto.initialPrice,
        stepPrice: dto.stepPrice,
        buyoutPrice: dto.buyoutPrice,
        comment: dto.comment,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
        companyId: dto.companyId,
        expiration: dto.expiration,
        manufactureDate: dto.manufactureDate,
        manufacturer: dto.manufacturer,
        gost: dto.gost,
        technicalConditions: dto.technicalConditions,
        auctionDuration: dto.auctionDuration,
        chatroomId: dto.chatroomId,
        images: dto.images.map(i => i.downloadUrl),
        documents: dto.documents.map(d => d.downloadUrl),
        isActive: true,
      },
    });

    if (dto.positions && dto.positions.length > 0) {
      await this.createPositions(createdAuction.id, dto.positions);
    }

    return this.getAuctionById(createdAuction.id);
  }

  private async createPositions(
    auctionId: string,
    positions: AuctionCreatePositionDto[],
  ) {
    const data = positions.map((pos) => ({
      auctionId,
      productId: pos.productName,
      totalVolume: pos.totalVolume,
      price: pos.price,
      cuttingTypeId: pos.cuttingType,
      sortId: pos.sort,
      catchAreaId: pos.catchArea,
      processingTypeId: pos.processingType,
      sizeId: pos.size,
    }));
    await this.prisma.auctionPosition.createMany({ data });
  }

  async getAuctionById(auctionId: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        positions: true
      },
    });
    if (!auction) {
      throw new NotFoundException(`Аукцион с ID="${auctionId}" не найден`);
    }
    return auction;
  }

  async getAuctionsList(type?: AuctionType) {
    const where: Prisma.AuctionWhereInput = {};
    if (type) {
      where.type = type;
    }

    return this.prisma.auction.findMany({
      where,
      include: {
        positions: true,
        // company: true
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAuction(auctionId: string, dto: AuctionUpdateDto) {
    const oldAuction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!oldAuction) {
      throw new NotFoundException('Аукцион не найден');
    }

    const updated = await this.prisma.auction.update({
      where: { id: auctionId },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
      include: { positions: true },
    });

    return updated;
  }

  async removeAuction(auctionId: string) {
    const oldAuction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!oldAuction) {
      throw new NotFoundException('Аукцион не найден');
    }

    return this.prisma.auction.update({
      where: { id: auctionId },
      data: { isActive: false },
    });
  }
}