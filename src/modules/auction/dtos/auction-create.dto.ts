import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuctionType, VolumeUnit } from '@prisma/client';
import { IsInt } from 'class-validator';

export class AuctionCreatePositionDto {
  @ApiProperty({ example: 'Минтай', description: 'Название позиции' })
  name: string;

  @ApiProperty({ example: 1000, description: 'Общий объём' })
  volume: number;

  @ApiProperty({ enum: VolumeUnit, example: VolumeUnit.KG })
  volumeUnit: VolumeUnit;

  @ApiProperty({ example: 300, description: 'Цена за единицу объёма' })
  price: number;
}

export class AuctionCreateDto {
  @ApiProperty({
    example: AuctionType.COLLECTIVE,
    enum: AuctionType,
    description: 'Тип аукциона: REGULAR или COLLECTIVE',
  })
  type: AuctionType;

  @ApiProperty({ example: 'Сборный лот №1001', description: 'Название аукциона' })
  title: string;

  @ApiProperty({ example: 10000, description: 'Начальная цена всего лота' })
  initialPrice: number;

  @ApiProperty({ example: 100, description: 'Шаг торгов' })
  stepPrice: number;

  @ApiProperty({ example: 20000, description: 'Сумма выкупа (опционально)' })
  buyoutPrice?: number;

  @ApiProperty({ example: 'Описание лота...', required: false })
  description?: string;

  @ApiProperty({ type: () => [AuctionCreatePositionDto], description: 'Позиции (для Сборного)' })
  positions?: AuctionCreatePositionDto[];

  @ApiPropertyOptional({ example: '2025-01-01T09:00:00.000Z' })
  startsAt?: Date;

  @ApiPropertyOptional({ example: '2025-01-02T09:00:00.000Z' })
  endsAt?: Date;

  @ApiProperty({
    description: 'Company ID',
    example: 12,
    required: false,
  })
  @IsInt()
  companyId: string;
}