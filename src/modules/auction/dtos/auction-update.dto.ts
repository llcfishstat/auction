import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuctionType } from '@prisma/client';

export class AuctionUpdateDto {
  @ApiPropertyOptional({ enum: AuctionType })
  type?: AuctionType;

  @ApiPropertyOptional({ example: 'Новое название аукциона' })
  title?: string;

  @ApiPropertyOptional({ example: 15000 })
  initialPrice?: number;

  @ApiPropertyOptional({ example: 150 })
  stepPrice?: number;

  @ApiPropertyOptional({ example: 30000 })
  buyoutPrice?: number;

  @ApiPropertyOptional({ example: 'Обновлённое описание...' })
  description?: string;

  @ApiPropertyOptional()
  startsAt?: Date;

  @ApiPropertyOptional()
  endsAt?: Date;
}