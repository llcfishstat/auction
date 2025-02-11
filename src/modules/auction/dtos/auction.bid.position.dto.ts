import { ApiProperty } from '@nestjs/swagger';

export class AuctionBidPositionDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    totalVolume: number;

    @ApiProperty()
    originalPrice: number;

    @ApiProperty()
    price: number;
}

export class AuctionBidDto {
    @ApiProperty()
    stepPrice: number;

    @ApiProperty()
    initialPrice: number;

    @ApiProperty({ type: [AuctionBidPositionDto] })
    positions: AuctionBidPositionDto[];
}
