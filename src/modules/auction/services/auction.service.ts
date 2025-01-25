import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/common/services/prisma.service';
import { AuctionParticipants, AuctionPosition, AuctionType, Prisma } from '@prisma/client';

import {
  AuctionCreateDto, AuctionCreateParticipantDto,
  AuctionCreatePositionDto,
} from 'src/modules/auction/dtos/auction-create.dto';
import { AuctionUpdateDto } from 'src/modules/auction/dtos/auction-update.dto';
import { AuctionResponseDto } from 'src/modules/auction/dtos/auction-response.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuctionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('POST_SERVICE') private readonly postClient: ClientProxy,
  ) {
    this.authClient.connect();
    this.postClient.connect();
  }

  async createAuction(dto: AuctionCreateDto): Promise<AuctionResponseDto> {
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

    if (dto.participants && dto.participants.length > 0) {
      await this.createParticipants(createdAuction.id, dto.participants);
    }

    const rawAuction = await this.prisma.auction.findUnique({
      where: { id: createdAuction.id },
      include: { positions: true, participants: true },
    });

    const enrichedPositions = await Promise.all(
      rawAuction.positions.map((pos) => this.enrichPosition(pos)),
    );

    const result = {
      ...rawAuction,
      positions: enrichedPositions,
      participants: dto.participants
    };

    return result;
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
    await this.prisma.auctionPosition.createMany({data});
  }

  private async createParticipants(
    auctionId: string,
    participants: AuctionCreateParticipantDto[],
  ) {
    const data = participants.map((part) => ({
      auctionId,
      companyId: part.companyId,
    }));

    await this.prisma.auctionParticipants.createMany({ data });
  }

  async getAuctionById(auctionId: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      include: { positions: true, participants: true },
    });
    if (!auction) {
      throw new NotFoundException(`Аукцион с ID="${auctionId}" не найден`);
    }

    const enrichedPositions = await Promise.all(
      auction.positions.map((pos) => this.enrichPosition(pos)),
    );

    const enrichedParticipants = await Promise.all(
      auction.participants.map((p) => this.enrichParticipant(p)),
    );

    return {
      ...auction,
      positions: enrichedPositions,
      participants: enrichedParticipants,
    };
  }

  async getAuctionsList(
    type?: AuctionType,
    page = 1,
    limit = 10,
    sort?: 'asc' | 'desc',
    search?: string,
  ): Promise<{ data: AuctionResponseDto[]; total: number }> {
    const where: Prisma.AuctionWhereInput = {};

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (type) {
      where.type = type;
    }

    const skip = (page - 1) * limit;
    const take = limit;

    let orderBy: Prisma.AuctionOrderByWithRelationInput = {
      createdAt: 'desc',
    };
    if (sort === 'asc') {
      orderBy = { createdAt: 'asc' };
    }
    console.log('where=', JSON.stringify(where));
    const [rawAuctions, total] = await Promise.all([
      this.prisma.auction.findMany({
        where,
        include: { positions: true, participants: true },
        orderBy,
        skip,
        take,
      }),
      this.prisma.auction.count({ where }),
    ]);
    console.log(rawAuctions);

    const data = await Promise.all(
      rawAuctions.map(async (auction) => {

        const enrichedPositions = await Promise.all(
          auction.positions.map((pos) => this.enrichPosition(pos)),
        );
        return {
          ...auction,
          positions: enrichedPositions,
          participants: auction.participants,
        };
      }),
    );

    return { data, total };
  }

  async updateAuction(auctionId: string, dto: AuctionUpdateDto) {
    const oldAuction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!oldAuction) throw new NotFoundException('Аукцион не найден');

    const updated = await this.prisma.auction.update({
      where: { id: auctionId },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
      include: { positions: true },
    });

    const enrichedPositions = await Promise.all(
      updated.positions.map((pos) => this.enrichPosition(pos))
    );

    return {
      ...updated,
      positions: enrichedPositions,
    }
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

  async enrichPosition(pos: AuctionPosition) {
    const {
      cuttingTypeId,
      sortId,
      catchAreaId,
      processingTypeId,
      sizeId,
      productId,
      ...rest
    } = pos;

    const postData = await lastValueFrom(
      this.postClient.send('getAllByIds', {
        cuttingTypeId,
        sortId,
        catchAreaId,
        processingTypeId,
        sizeId,
        productId,
      }),
    );

    return {
      ...rest,
      product: postData.product ?? null,
      cutting: postData.cutting ?? null,
      sort: postData.sort ?? null,
      catchArea: postData.catchArea ?? null,
      processingType: postData.processingType ?? null,
      size: postData.size ?? null,
    };
  }

  private async enrichParticipant(participant: AuctionParticipants) {
    const { auctionId, ...rest } = participant;
    const companyData = await lastValueFrom(
      this.authClient.send('getCompanyById', { companyId: participant.companyId }),
    );

    return {
      ...rest,
      company: companyData,
    };
  }
}