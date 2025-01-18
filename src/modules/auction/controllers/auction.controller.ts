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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuctionService } from 'src/modules/auction/services/auction.service';
import { AuctionCreateDto } from 'src/modules/auction/dtos/auction-create.dto';
import { AuctionUpdateDto } from 'src/modules/auction/dtos/auction-update.dto';
import { AuctionType } from '@prisma/client';

import { AuthUser } from 'src/common/decorators/auth.decorator';
import { IAuthUser } from 'src/modules/auction/interfaces/auction.interface';

@ApiTags('auction')
@Controller({
  version: '1',
  path: '/auction',
})
@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @ApiBearerAuth('accessToken')
  @Post()
  async createAuction(
    @AuthUser() user: IAuthUser,
    @Body() dto: AuctionCreateDto,
  ) {
    return this.auctionService.createAuction(dto);
  }

  @ApiBearerAuth('accessToken')
  @Get()
  async getAuctionsList(@Query('type') type?: AuctionType) {
    return this.auctionService.getAuctionsList(type);
  }

  @ApiBearerAuth('accessToken')
  @Get(':auctionId')
  async getAuction(@Param('auctionId') auctionId: string) {
    return this.auctionService.getAuctionById(auctionId);
  }

  @ApiBearerAuth('accessToken')
  @Put(':auctionId')
  async updateAuction(
    @AuthUser() user: IAuthUser,
    @Param('auctionId') auctionId: string,
    @Body() dto: AuctionUpdateDto,
  ) {
    return this.auctionService.updateAuction(auctionId, dto);
  }

  @ApiBearerAuth('accessToken')
  @Delete(':auctionId')
  async removeAuction(
    @AuthUser() user: IAuthUser,
    @Param('auctionId') auctionId: string,
  ) {
    return this.auctionService.removeAuction(auctionId);
  }
}