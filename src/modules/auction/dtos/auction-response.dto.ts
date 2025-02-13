import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuctionType, VolumeUnit } from '@prisma/client';

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
        description: 'Record creation date',
        example: '2024-01-01T12:34:56Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date of the last update',
        example: '2024-01-02T10:11:12Z',
    })
    updatedAt: Date;

    @ApiProperty({
        description: 'Список сопроводительных документов',
        example: ['ГОСТ', 'ТУ', 'Паспорт качества'],
    })
    accompanyingDocuments: string[];

    @ApiProperty({
        description: 'Наименование склада хранения',
        example: 'Основной холодильник №1',
    })
    storageName: string;

    @ApiProperty({
        description: 'Вес одной штуки',
        example: 2.5,
    })
    onePieceWeight: number;

    @ApiProperty({
        description: 'Адрес склада хранения',
        example: 'г. Владивосток, ул. Приморская, 10',
    })
    storageAddress: string;

    @ApiProperty({
        description: 'Температура хранения (в градусах)',
        example: -18,
    })
    storageTemperature: number;

    @ApiProperty({
        description: 'Единица измерения объёма (штук, кг, литры и т.д.)',
        enum: VolumeUnit,
        example: VolumeUnit.KG,
    })
    storateUnit: VolumeUnit;

    @ApiProperty({
        description: 'Признак, что товар продаётся с борта судна',
        example: true,
    })
    saleFromShip: boolean;

    @ApiPropertyOptional({
        description: 'Название судна (если saleFromShip = true)',
        example: 'Рыболовецкое судно "Альбатрос"',
    })
    shipName: string;

    @ApiPropertyOptional({
        description: 'Порт прибытия (если saleFromShip = true)',
        example: 'Порт Владивосток',
    })
    arrivalPort?: string;

    @ApiPropertyOptional({
        description: 'Дата прибытия (если saleFromShip = true)',
        example: '2025-02-10T08:00:00.000Z',
    })
    arrivalDate?: Date;

    @ApiPropertyOptional({
        description: 'Комментарий к дополнительным услугам',
        example: 'Может потребоваться перегрузка на другой склад',
    })
    additionalServicesComment?: string;

    @ApiProperty({
        description: 'Company ID',
        example: 'cf024c64-3b2c-4c57-bc83-233d36ad1d66',
    })
    id: string;

    @ApiProperty({
        example: { id: 1, name: 'Акула полярная' },
        type: () => DictionaryItemDto,
    })
    product: DictionaryItemDto;

    @ApiProperty({ example: 1200 })
    totalVolume: number;

    @ApiProperty({ example: 120 })
    price: number;

    @ApiPropertyOptional({
        example: { id: 1, name: 'БГ' },
        type: () => DictionaryItemDto,
    })
    cutting?: DictionaryItemDto;

    @ApiPropertyOptional({
        example: { id: 1, name: '2-й сорт' },
        type: () => DictionaryItemDto,
    })
    sort?: DictionaryItemDto;

    @ApiPropertyOptional({
        example: { id: 1, name: '61.01: Западно-Беринговоморская зона...' },
        type: () => DictionaryItemDto,
    })
    catchArea?: DictionaryItemDto;

    @ApiPropertyOptional({
        example: { id: 2, name: 'Мороженая' },
        type: () => DictionaryItemDto,
    })
    processingType?: DictionaryItemDto;

    @ApiPropertyOptional({
        example: { id: 3, name: '3S' },
        type: () => DictionaryItemDto,
    })
    size?: DictionaryItemDto;

    @ApiProperty({ example: '2025-01-20T12:14:03.010Z' })
    manufactureDate: Date;

    @ApiProperty({ example: 'Some Manufacturer' })
    manufacturer: string;

    @ApiProperty({ example: 'Expiration' })
    expiration: number;

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

    @ApiProperty({ example: 'Some comment', nullable: true })
    comment?: string;

    @ApiPropertyOptional({
        example: [{ id: 2, name: 'Логистические услуги' }],
        type: () => [DictionaryItemDto],
    })
    additionalServices?: DictionaryItemDto[];
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

    @ApiProperty({ example: 'Starts at' })
    startsAt: Date;

    @ApiProperty({ example: 'Ends at' })
    endsAt: Date;

    @ApiProperty({ example: true, description: 'Активен ли аукцион' })
    isActive: boolean;

    @ApiProperty({ example: true, description: 'Публичный ли аукцион' })
    isPublic: boolean;

    @ApiProperty({ type: [AuctionPositionResponseDto] })
    positions: AuctionPositionResponseDto[];

    @ApiProperty({
        type: [AuctionParticipantResponseDto],
        description: 'Компании участники аукциона',
    })
    participants: AuctionParticipantResponseDto[];

    @ApiProperty({
        type: () => CompanyDto,
        description: 'Компания, создавшая аукцион (может быть null, если не указано)',
    })
    company?: CompanyDto;

    @ApiProperty({ example: 0 })
    chatroomId: string;

    @ApiProperty({ example: '283336262', description: 'Серийный номер аукциона' })
    serialNumber;
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
