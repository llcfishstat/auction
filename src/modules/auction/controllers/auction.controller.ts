import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
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

@ApiTags('auction')
@ApiBearerAuth('accessToken')
@Controller({ version: '1', path: '/auction' })
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  @ApiCreatedResponse({
    type: AuctionResponseDto,
    description: 'Creates a new auction and returns its data.',
  })
  async createAuction(
    @AuthUser() user: IAuthUser,
    @Body() dto: AuctionCreateDto,
  ): Promise<AuctionResponseDto> {
    const auction = await this.auctionService.createAuction(dto);
    return auction;
  }

  @Get()
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
  @ApiOkResponse({
    type: AuctionResponseDto,
    description: 'Returns one auction by ID.',
  })
  async getAuction(@Param('auctionId') auctionId: string): Promise<AuctionResponseDto> {
    return this.auctionService.getAuctionById(auctionId);
  }

  @Put(':auctionId')
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
  @ApiOkResponse({
    type: AuctionRemoveResponseDto,
    description: 'Removes an auction and returns confirmation data.',
  })
  async removeAuction(
    @AuthUser() user: IAuthUser,
    @Param('auctionId') auctionId: string,
  ): Promise<AuctionRemoveResponseDto> {
    return this.auctionService.removeAuction(auctionId);
  }
}