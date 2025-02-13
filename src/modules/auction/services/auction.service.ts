import {
    Injectable,
    NotFoundException,
    Inject,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/common/services/prisma.service';
import { AuctionParticipants, AuctionPosition, AuctionType, Prisma } from '@prisma/client';

import {
    AuctionCreateDto,
    AuctionCreateParticipantDto,
    AuctionCreatePositionDto,
} from 'src/modules/auction/dtos/auction-create.dto';
import { AuctionUpdateDto } from 'src/modules/auction/dtos/auction-update.dto';
import { AuctionResponseDto } from 'src/modules/auction/dtos/auction-response.dto';
import { lastValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuctionBidDto } from 'src/modules/auction/dtos/auction.bid.position.dto';
import { IAuthUser } from 'src/modules/auction/interfaces/auction.interface';

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

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        const now = new Date();

        const auctionsToClose = await this.prisma.auction.findMany({
            where: {
                isActive: true,
                endsAt: { lte: now },
            },
        });

        if (!auctionsToClose.length) return;

        for (const auction of auctionsToClose) {
            const winnerUserId = auction.lastStepPriceUserId;

            await this.prisma.$transaction(async tx => {
                await tx.auction.update({
                    where: { id: auction.id },
                    data: {
                        isActive: false,
                        updatedAt: new Date(),
                    },
                });

                if (winnerUserId) {
                    await tx.auctionWinner.create({
                        data: {
                            auctionId: auction.id,
                            userId: winnerUserId,
                        },
                    });
                }
            });
        }
    }

    async createAuction(dto: AuctionCreateDto): Promise<AuctionResponseDto> {
        const baseStartsAt = dto.startsAt ? new Date(dto.startsAt) : new Date();

        const endsAtDate = new Date(baseStartsAt.getTime() + dto.auctionDuration * 60 * 60 * 1000);

        const createdAuction = await this.prisma.auction.create({
            data: {
                type: dto.type,
                title: dto.title,
                initialPrice: dto.initialPrice,
                stepPrice: dto.stepPrice,
                buyoutPrice: dto.buyoutPrice,
                startsAt: dto.startsAt ? new Date(dto.startsAt) : baseStartsAt,
                endsAt: endsAtDate,
                companyId: dto.companyId,
                auctionDuration: dto.auctionDuration,
                chatroomId: dto.chatroomId,
                isActive: true,
                isPublic: true,
                serialNumber: Math.floor(Math.random() * 900000000) + 100000000,
            },
        });

        if (dto.positions && dto.positions.length > 0) {
            if (dto.type === AuctionType.REGULAR && dto.positions.length > 1) {
                throw new BadRequestException(
                    `Для аукциона с типом ${AuctionType.REGULAR} нельзя добавить больше 1 позиции`,
                );
            }

            await this.createPositions(createdAuction.id, dto.positions);
        }

        if (dto.participants && dto.participants.length > 0) {
            await this.createParticipants(createdAuction.id, dto.participants);
        }

        if (dto.isPublic) {
            await this.createPublicParticipants(createdAuction.id);
        }

        const rawAuction = await this.prisma.auction.findUnique({
            where: { id: createdAuction.id },
            include: { positions: true, participants: true },
        });

        const enrichedPositions = await Promise.all(
            rawAuction.positions.map(pos => this.enrichPosition(pos)),
        );

        const enrichedParticipants = await Promise.all(
            rawAuction.participants.map(p => this.enrichParticipant(p)),
        );

        const result: AuctionResponseDto = {
            ...rawAuction,
            positions: enrichedPositions,
            participants: enrichedParticipants,
        };

        return result;
    }

    private async createPositions(auctionId: string, positions: AuctionCreatePositionDto[]) {
        const data: Prisma.AuctionPositionCreateManyInput[] = positions.map(pos => ({
            ...pos,
            auctionId,
            images: pos.images.map(item => item.downloadUrl),
            documents: pos.documents.map(item => item.downloadUrl),
        }));
        await this.prisma.auctionPosition.createMany({ data });
    }

    private async createParticipants(
        auctionId: string,
        participants: AuctionCreateParticipantDto[],
    ) {
        const data = participants.map(part => ({
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

        let createdByCompany = null;
        if (auction.companyId) {
            createdByCompany = await this.enrichCompany(auction.companyId);
        }

        const enrichedPositions = await Promise.all(
            auction.positions.map(pos => this.enrichPosition(pos)),
        );

        const enrichedParticipants = await Promise.all(
            auction.participants.map(p => this.enrichParticipant(p)),
        );

        return {
            ...auction,
            positions: enrichedPositions,
            participants: enrichedParticipants,
            company: createdByCompany,
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

        const data = await Promise.all(
            rawAuctions.map(async auction => {
                const enrichedPositions = await Promise.all(
                    auction.positions.map(pos => this.enrichPosition(pos)),
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
            include: { positions: true, participants: true },
        });

        const enrichedPositions = await Promise.all(
            updated.positions.map(pos => this.enrichPosition(pos)),
        );

        const enrichedParticipants = await Promise.all(
            updated.participants.map(participant => this.enrichParticipant(participant)),
        );

        return {
            ...updated,
            positions: enrichedPositions,
            participants: enrichedParticipants,
        };
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
            additionalServices,
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
                additionalServices,
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
            additionalServices: postData.additionalServices ?? null,
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

    private async createPublicParticipants(auctionId: string) {
        const companies = await lastValueFrom(this.authClient.send('getAllCompaniesIds', {}));

        const data = companies.map(c => ({
            auctionId,
            companyId: c.id,
        }));

        await this.prisma.auctionParticipants.createMany({ data });
    }

    private async enrichCompany(companyId: string) {
        const companyData = await lastValueFrom(
            this.authClient.send('getCompanyById', { companyId }),
        );
        return companyData;
    }

    async makeBid(auctionId: string, bidDto: AuctionBidDto, user: IAuthUser) {
        const auction = await this.prisma.auction.findUnique({
            where: { id: auctionId },
            include: { positions: true },
        });

        if (!auction) {
            throw new NotFoundException(`Аукцион c ID=${auctionId} не найден`);
        }

        if (!auction.isActive) {
            throw new BadRequestException('Аукцион уже завершён');
        }

        if (auction.stepPrice !== bidDto.stepPrice) {
            throw new ConflictException('Step price was changed. Please refresh the page.');
        }

        const sumFromBid = bidDto.positions.reduce((acc, p) => acc + p.price * p.totalVolume, 0);

        const requiredMinSum = auction.stepPrice;

        if (sumFromBid < requiredMinSum) {
            throw new BadRequestException(
                `Сумма всех позиций (${sumFromBid}) ниже требуемой суммы: ${requiredMinSum}`,
            );
        }

        for (const pos of bidDto.positions) {
            const dbPos = auction.positions.find(ap => ap.id === pos.id);
            if (!dbPos) {
                throw new NotFoundException(`Позиция с ID=${pos.id} не найдена в аукционе`);
            }

            if (pos.price < dbPos.price) {
                throw new BadRequestException(
                    `Position ${pos.id}: new price ${pos.price} is below the current DB price ${dbPos.price}`,
                );
            }
        }

        const newStepPrice = sumFromBid;

        await this.prisma.$transaction(async tx => {
            for (const pos of bidDto.positions) {
                await tx.auctionPosition.update({
                    where: { id: pos.id },
                    data: {
                        price: pos.price,
                    },
                });
            }

            await tx.auction.update({
                where: { id: auctionId },
                data: {
                    stepPrice: newStepPrice,
                    lastStepPriceUserId: user.id,
                },
            });
        });

        const updatedAuction = await this.getAuctionById(auctionId);

        return updatedAuction;
    }

    async buyoutAuction(auctionId: string, user: IAuthUser): Promise<AuctionResponseDto> {
        const auction = await this.prisma.auction.findUnique({
            where: { id: auctionId },
        });

        if (!auction) {
            throw new NotFoundException(`Аукцион с ID=${auctionId} не найден`);
        }

        if (!auction.isActive) {
            throw new BadRequestException('Аукцион уже завершён');
        }

        await this.prisma.$transaction(async tx => {
            await tx.auction.update({
                where: { id: auctionId },
                data: {
                    isActive: false,
                    lastStepPriceUserId: user.id,
                },
            });

            await tx.auctionWinner.create({
                data: {
                    auctionId: auctionId,
                    userId: user.id,
                },
            });
        });

        const updatedAuction = await this.getAuctionById(auctionId);
        return updatedAuction;
    }
}
