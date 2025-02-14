import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AuctionDeleteDto {
    @ApiPropertyOptional({
        description: 'Reason for deleting the auction',
        example: 'Auction is not needed anymore',
    })
    @IsString()
    @IsOptional()
    reason?: string;
}
