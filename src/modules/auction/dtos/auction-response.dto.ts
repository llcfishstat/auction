import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuctionType } from '@prisma/client';

export class DictionaryItemDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Акула полярная' })
    name: string;
}

export class CompanyDto {
    @ApiProperty({
        description: 'Company ID',
        example: 'cf024c64-3b2c-4c57-bc83-233d36ad1d66',
    })
    id: string;

    @ApiProperty({
        description: 'Director first name',
        example: 'Павел',
    })
    directorFirstName: string;

    @ApiProperty({
        description: 'Director last name',
        example: 'Рублев',
    })
    directorLastName: string;

    @ApiProperty({
        description: 'Director patronymic (middle name), if present',
        example: 'Михайлович',
        required: false,
    })
    directorPatronymic?: string;

    @ApiProperty({
        description: 'Taxpayer Identification Number, if present',
        example: '2537140750',
        required: false,
    })
    inn: string;

    @ApiProperty({
        description: 'Primary State Registration Number, if present',
        example: '1192536019059',
        required: false,
    })
    ogrn: string;

    @ApiProperty({
        description: 'Company name',
        example: 'ООО ФИШСТАТ',
    })
    organizationName: string;

    @ApiProperty({
        description: 'Country of registration, if present',
        example: 'Россия',
        required: false,
    })
    country: string;

    @ApiProperty({
        description: 'City of registration, if present',
        example: 'Владивосток',
        required: false,
    })
    city: string;

    @ApiProperty({
        description: 'Legal address, if present',
        example: '690021, Приморский край, город Владивосток, Черемуховая ул, д. 7, офис 410',
        required: false,
    })
    legalAddress?: string;

    @ApiProperty({
        description: 'Company email, if present',
        example: 'support@fishstat.ru',
        required: false,
    })
    email?: string;

    @ApiProperty({
        description: 'Company phone number, if present',
        example: '79999999999',
        required: false,
    })
    phone?: string;

    @ApiProperty({
        description: 'Short description of the company, if present',
        example: 'Площадка для торговли рыбой',
        required: false,
    })
    description?: string;

    @ApiProperty({
        description: 'Link to the registration document, if present',
        required: false,
    })
    documentUrl?: string;

    @ApiPropertyOptional({
        description: 'URL of the company logo',
        example: 'https://my-bucket.s3.amazonaws.com/company-logos/acme.jpg',
    })
    logoUrl?: string;

    @ApiProperty({
        description: 'Verification status (UNVERIFIED / VERIFIED)',
        example: 'UNVERIFIED',
    })
    status: string;

    @ApiProperty({
        description: 'Record creation date',
        example: '2024-01-01T12:34:56Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date of the last update',
        example: '2024-01-02T10:11:12Z',
    })
    updatedAt: Date;
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

export class AuctionParticipantResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'company-id-123' })
    companyId: string;

    @ApiProperty({
        example: '2025-01-25T00:16:04.032Z',
        description: 'Когда пользователь присоединился',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2025-01-25T00:16:04.032Z',
        description: 'Когда участник обновил информацию',
    })
    updatedAt: Date;
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

    @ApiProperty({ example: 'Starts at' })
    startsAt: Date;

    @ApiProperty({ example: 'Ends at' })
    endsAt: Date;

    @ApiProperty({ example: 'Expiration' })
    expiration: number;

    @ApiProperty({ example: true, description: 'Активен ли аукцион' })
    isActive: boolean;

    @ApiProperty({ example: true, description: 'Публичный ли аукцион' })
    isPublic: boolean;

    @ApiProperty({
        isArray: true,
        type: String,
        description: 'Массив URL изображений (если храним именно строки)',
    })
    images: string[];

    @ApiProperty({
        isArray: true,
        type: String,
        description: 'Массив URL документов (если храним именно строки)',
    })
    documents: string[];

    @ApiProperty({ type: [AuctionPositionResponseDto] })
    positions: AuctionPositionResponseDto[];

    @ApiProperty({ type: [AuctionParticipantResponseDto], description: 'Компании участники аукциона' })
    participants: AuctionParticipantResponseDto[];

    @ApiProperty({
        type: () => CompanyDto,
        description: 'Компания, создавшая аукцион (может быть null, если не указано)'
    })
    company?: CompanyDto;

    @ApiProperty({ example: 0 })
    chatroomId: number;
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
