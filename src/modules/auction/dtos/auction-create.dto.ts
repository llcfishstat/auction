import { ApiProperty } from '@nestjs/swagger';
import { AuctionType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AuctionParticipantResponseDto } from './auction-response.dto';

export class FileItemDto {
  @ApiProperty({ example: 1737376136663 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'liza-vasilenko-slitye-goryachie-foto-46.jpg' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: '678e41872d4fa04d88be77ad' })
  @IsString()
  fileId: string;

  @ApiProperty({
    example:
      'https://s3.timeweb.cloud/480321c2-fishstat/company-files?...',
  })
  @IsString()
  downloadUrl: string;
}

export class AuctionCreatePositionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  productName: number;

  @ApiProperty({ example: 1200 })
  @IsInt()
  totalVolume: number;

  @ApiProperty({ example: 120 })
  @IsInt()
  price: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  cuttingType?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  sort?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  catchArea?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  processingType?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  size?: number;
}

export class AuctionCreateParticipantDto {
  @ApiProperty({ example: 'company-123' })
  @IsString()
  companyId: string;
}

export class AuctionCreateDto {
  @ApiProperty({ enum: AuctionType, example: AuctionType.REGULAR })
  type: AuctionType;

  @ApiProperty({ example: 'Auction Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  initialPrice: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  stepPrice: number;

  @ApiProperty({ example: 0 })
  @IsOptional()
  @IsInt()
  buyoutPrice?: number;

  @ApiProperty({ example: '2025-01-20T12:14:03.010Z' })
  @IsDateString()
  manufactureDate: string;

  @ApiProperty({ example: 'Some Manufacturer' })
  @IsString()
  manufacturer: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  gost: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  technicalConditions: boolean;

  @ApiProperty({ example: 'Some comment' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    type: [FileItemDto],
    example: [
      {
        id: 1737376136663,
        fileName: 'liza-vasilenko-slitye-goryachie-foto-46.jpg',
        fileId: '678e41872d4fa04d88be77ad',
        downloadUrl: 'https://s3.timeweb.cloud/480321c2-fishstat/company-files?...',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileItemDto)
  images?: FileItemDto[];

  @ApiProperty({
    type: [FileItemDto],
    example: [
      {
        id: 1737376160867,
        fileName: 'импедансометрия.pdf',
        fileId: '678e419a2d4fa04d88be77b0',
        downloadUrl: 'https://s3.timeweb.cloud/...',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileItemDto)
  documents: FileItemDto[];

  @ApiProperty({ example: 3 })
  @IsInt()
  auctionDuration: number;

  @ApiProperty({ example: '2025-01-20T15:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiProperty({ example: '2025-01-20T18:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiProperty({ example: '2025-02-01T00:00:00.000Z' })
  @IsInt()
  expiration: number;

  @ApiProperty({ example: 'company-id-123' })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({ example: 'chatroomId-123' })
  @IsOptional()
  @IsInt()
  chatroomId?: number;

  @ApiProperty({ type: [AuctionCreatePositionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuctionCreatePositionDto)
  positions?: AuctionCreatePositionDto[];

  @ApiProperty({ type: [AuctionParticipantResponseDto] })
  @IsArray()
  participants?: AuctionParticipantResponseDto[];
}