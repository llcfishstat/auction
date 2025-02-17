import { Body, Controller, Get, Param, Post, Put, Query, Delete, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuctionService } from 'src/modules/auction/services/auction.service';
import { AuctionCreateDto } from 'src/modules/auction/dtos/auction-create.dto';
import { AuctionUpdateDto } from 'src/modules/auction/dtos/auction-update.dto';
import { AuctionType } from '@prisma/client';
import { AuthUser } from 'src/common/decorators/auth.decorator';
import { IAuthUser } from 'src/modules/auction/interfaces/auction.interface';

import {
    AuctionResponseDto,
    AuctionListResponseDto,
    AuctionRemoveResponseDto,
} from 'src/modules/auction/dtos/auction-response.dto';
import { AuctionBidDto } from 'src/modules/auction/dtos/auction.bid.position.dto';
import { AuctionDeleteDto } from '../dtos/auction-delete.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CompanyResponseDto } from '../dtos/company-response.dto';
import { UserResponseDto } from '../dtos/user.response.dto';

@ApiTags('auction')
@Controller({ version: '1', path: '/auction' })
export class AuctionController {
    constructor(
        private readonly auctionService: AuctionService,
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {
        this.authClient.connect();
    }

    @Post()
    @ApiBearerAuth('accessToken')
    @ApiCreatedResponse({
        type: AuctionResponseDto,
        description: 'Creates a new auction and returns its data.',
    })
    async createAuction(
        @AuthUser() user: IAuthUser,
        @Body() dto: AuctionCreateDto,
    ): Promise<AuctionResponseDto> {
        const auction = await this.auctionService.createAuction(dto);

        const auctionCompany: CompanyResponseDto = await firstValueFrom(
            this.authClient.send('companyById', JSON.stringify({ companyId: dto.companyId })),
        );

        Promise.all(
            dto.participants.map(async p => {
                const users: UserResponseDto[] = await firstValueFrom(
                    this.authClient.send(
                        'usersByCompanyId',
                        JSON.stringify({ companyId: p.companyId }),
                    ),
                );

                await Promise.all(
                    users.map(user => {
                        this.auctionService.sendNotification(user.email, 'AUCTION_JOIN', {
                            toName: [user.lastName, user.firstName, user.patronymic]
                                .filter(Boolean)
                                .join(' '),
                            companyLogo: auctionCompany.logoUrl,
                            company: auctionCompany.organizationName,
                            product: dto.title,
                            auctionHref: `https://fishstat.ru/auctions/${auction.id}`,
                            companyChat: `https://fishstat.ru/chat?chatroomId=${auction.chatroomId}`,
                        });
                    }),
                ).catch(error => {
                    console.log('error 1:', error);
                });
            }),
        ).catch(console.log);

        return auction;
    }

    @Get()
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        type: AuctionListResponseDto,
        description: 'Returns a list of auctions (optionally filtered by type).',
    })
    async getAuctionsList(
        @Query('type') type?: AuctionType,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('sort') sort?: 'asc' | 'desc',
        @Query('search') search?: string,
    ): Promise<AuctionListResponseDto> {
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;

        const { data, total } = await this.auctionService.getAuctionsList(
            type,
            pageNumber,
            limitNumber,
        );

        return { data, total };
    }

    @Get(':auctionId')
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        type: AuctionResponseDto,
        description: 'Returns one auction by ID.',
    })
    async getAuction(@Param('auctionId') auctionId: string): Promise<AuctionResponseDto> {
        return this.auctionService.getAuctionById(auctionId);
    }

    @Put(':auctionId')
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        type: AuctionResponseDto,
        description: 'Updates auction and returns the updated entity.',
    })
    async updateAuction(
        @AuthUser() user: IAuthUser,
        @Param('auctionId') auctionId: string,
        @Body() dto: AuctionUpdateDto,
    ): Promise<AuctionResponseDto> {
        return this.auctionService.updateAuction(auctionId, dto);
    }

    @Delete(':auctionId')
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        type: AuctionRemoveResponseDto,
        description: 'Removes an auction and returns confirmation data.',
    })
    async removeAuction(
        @Param('auctionId') auctionId: string,
        @Body() dto: AuctionDeleteDto,
    ): Promise<AuctionRemoveResponseDto> {
        const auction = await this.auctionService.removeAuction(auctionId, dto);

        const auctionCompany: CompanyResponseDto = await firstValueFrom(
            this.authClient.send('companyById', JSON.stringify({ companyId: auction.companyId })),
        );

        auction.participants.map(async p => {
            const users: UserResponseDto[] = await firstValueFrom(
                this.authClient.send(
                    'usersByCompanyId',
                    JSON.stringify({ companyId: p.companyId }),
                ),
            );

            users.forEach(user => {
                this.auctionService.sendNotification(user.email, 'AUCTION_THANX', {
                    toName: [user.lastName, user.firstName, user.patronymic]
                        .filter(Boolean)
                        .join(' '),
                    companyLogo: auctionCompany.logoUrl,
                    company: auctionCompany.organizationName,
                    product: auction.title,
                    auctionHref: `https://fishstat.ru/auctions/${auction.id}`,
                });
            });
        });

        return auction;
    }

    @Post(':auctionId/bid')
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: 'Makes a bid on an auction. Returns updated auction or success info.',
    })
    async makeBid(
        @AuthUser() user: IAuthUser,
        @Param('auctionId') auctionId: string,
        @Body() bidDto: AuctionBidDto,
    ): Promise<AuctionResponseDto> {
        console.log(user);
        return this.auctionService.makeBid(auctionId, bidDto, user);
    }

    @Post(':auctionId/buyout')
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: 'Performs a buyout on the auction, making it inactive and saving the winner.',
    })
    async buyoutAuction(
        @AuthUser() user: IAuthUser,
        @Param('auctionId') auctionId: string,
    ): Promise<AuctionResponseDto> {
        const auction = await this.auctionService.buyoutAuction(auctionId, user);

        const winnerUser: UserResponseDto = await firstValueFrom(
            this.authClient.send('userById', JSON.stringify({ userId: user.id })),
        );

        const auctionCompany: CompanyResponseDto = await firstValueFrom(
            this.authClient.send('companyById', JSON.stringify({ companyId: auction.company.id })),
        );

        this.auctionService.sendNotification(winnerUser.email, 'AUCTION_WINNER', {
            toName: [winnerUser.lastName, winnerUser.firstName, winnerUser.password]
                .filter(Boolean)
                .join(' '),
            companyLogo: auctionCompany.logoUrl,
            company: auctionCompany.organizationName,
            product: auction.title,
            auctionHref: `https://fishstat.ru/auctions/${auction.id}`,
            companyChat: `https://fishstat.ru/chat?chatroomId=${auction.chatroomId}`,
        });

        auction.participants.map(async p => {
            const users: UserResponseDto[] = await firstValueFrom(
                this.authClient.send(
                    'usersByCompanyId',
                    JSON.stringify({ companyId: p.companyId }),
                ),
            );

            users.forEach(user => {
                this.auctionService.sendNotification(user.email, 'AUCTION_THANX', {
                    toName: [user.lastName, user.firstName, user.patronymic]
                        .filter(Boolean)
                        .join(' '),
                    companyLogo: auctionCompany.logoUrl,
                    company: auctionCompany.organizationName,
                    product: auction.title,
                    auctionHref: `https://fishstat.ru/auctions/${auction.id}`,
                });
            });
        });

        return auction;
    }
}
