import { ApiProperty } from '@nestjs/swagger';
import { AuctionType } from '@prisma/client';

export class DictionaryItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Акула полярная' })
  name: string;
}

export class AuctionPositionResponseDto {
  @ApiProperty({
    example: { id: 1, name: 'Акула полярная' },
    nullable: false,
  })
  product: DictionaryItemDto;

  @ApiProperty({ example: 1200 })
  totalVolume: number;

  @ApiProperty({ example: 120 })
  price: number;

  @ApiProperty({
    example: { id: 1, name: 'БГ' },
    nullable: true,
  })
  cutting?: DictionaryItemDto;

  @ApiProperty({
    example: { id: 1, name: '2-й сорт' },
    nullable: true,
  })
  sort?: DictionaryItemDto;

  @ApiProperty({
    example: { id: 1, name: '61.01: Западно-Беринговоморская зона...' },
    nullable: true,
  })
  catchArea?: DictionaryItemDto;

  @ApiProperty({
    example: { id: 2, name: 'Мороженая' },
    nullable: true,
  })
  processingType?: DictionaryItemDto;

  @ApiProperty({
    example: { id: 3, name: '3S' },
    nullable: true,
  })
  size?: DictionaryItemDto;
}

export class AuctionResponseDto {
  @ApiProperty({ example: 'fsdffd-dsfdsf-sdfdsff' })
  id: string;

  @ApiProperty({ enum: AuctionType })
  type: AuctionType;

  @ApiProperty({ example: 'Auction Title' })
  title: string;

  @ApiProperty({ example: 0 })
  initialPrice: number;

  @ApiProperty({ example: 0 })
  stepPrice: number;

  @ApiProperty({ example: 0, nullable: true })
  buyoutPrice?: number;

  @ApiProperty({ example: '2025-01-20T12:14:03.010Z' })
  manufactureDate: Date;

  @ApiProperty({ example: 'Some Manufacturer' })
  manufacturer: string;

  @ApiProperty({ example: true })
  gost: boolean;

  @ApiProperty({ example: true })
  technicalConditions: boolean;

  @ApiProperty({ example: 'Some comment', nullable: true })
  comment?: string;

  @ApiProperty({ type: [AuctionPositionResponseDto] })
  positions: AuctionPositionResponseDto[];

}

export class AuctionListResponseDto {
  @ApiProperty({ type: [AuctionResponseDto] })
  data: AuctionResponseDto[];

  @ApiProperty({ example: 42 })
  total: number;
}

export class AuctionRemoveResponseDto {
  @ApiProperty({ example: 123 })
  id: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}