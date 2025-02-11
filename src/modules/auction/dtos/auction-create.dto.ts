import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuctionType, VolumeUnit } from '@prisma/client';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
        example: 'https://s3.timeweb.cloud/480321c2-fishstat/company-files?...',
    })
    @IsString()
    downloadUrl: string;
}

export class AuctionCreatePositionDto {
    @ApiProperty({
        description: 'Дата производства/выработки товара',
        example: '2025-01-01T00:00:00.000Z',
    })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    public manufactureDate: Date;

    @ApiProperty({
        description: 'Общий объём продукции (в единицах, заданных в storateUnit)',
        example: 1000,
    })
    @IsNumber()
    @IsNotEmpty()
    totalVolume: number;

    @ApiProperty({
        description: 'Цена за всю позицию (или единицу, если предполагается)',
        example: 15000,
    })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({
        description: 'Идентификатор товара',
        example: 42,
    })
    @IsInt()
    @IsNotEmpty()
    productId: number;

    @ApiProperty({
        description: 'Идентификатор типа обработки',
        example: 101,
    })
    @IsInt()
    @IsNotEmpty()
    processingTypeId: number;

    @ApiProperty({
        description: 'Идентификатор типа разделки',
        example: 202,
    })
    @IsInt()
    @IsNotEmpty()
    cuttingTypeId: number;

    @ApiProperty({
        description: 'Идентификатор сорта',
        example: 303,
    })
    @IsInt()
    @IsNotEmpty()
    sortId: number;

    @ApiProperty({
        description: 'Идентификатор размерной группы',
        example: 404,
    })
    @IsInt()
    @IsNotEmpty()
    sizeId: number;

    @ApiProperty({
        description: 'Район вылова',
        example: 505,
    })
    @IsInt()
    @IsNotEmpty()
    catchAreaId: number;

    @ApiProperty({
        description: 'Срок годности (в сутках, днях и т.п.)',
        example: 30,
    })
    @IsInt()
    @IsNotEmpty()
    expiration: number;

    @ApiProperty({
        description: 'Наименование/название производителя',
        example: 'ООО «Рыбозавод»',
    })
    @IsString()
    @IsNotEmpty()
    manufacturer: string;

    @ApiProperty({
        description: 'Список сопроводительных документов',
        example: ['Сертификат качества', 'Паспорт безопасности'],
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    accompanyingDocuments: string[];

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

    @ApiPropertyOptional({
        description: 'Комментарий',
        example: 'Есть небольшой дефект упаковки',
    })
    @IsString()
    @IsOptional()
    comment: string;

    @ApiProperty({
        description: 'Наименование склада хранения',
        example: 'Основной холодильник №1',
    })
    @IsString()
    @IsNotEmpty()
    storageName: string;

    @ApiProperty({
        description: 'Вес одной штуки',
        example: 2.5,
    })
    @IsNumber()
    @IsNotEmpty()
    onePieceWeight: number;

    @ApiProperty({
        description: 'Адрес склада хранения',
        example: 'г. Владивосток, ул. Приморская, 10',
    })
    @IsString()
    @IsNotEmpty()
    storageAddress: string;

    @ApiProperty({
        description: 'Температура хранения (в градусах)',
        example: -18,
    })
    @IsNumber()
    @IsNotEmpty()
    storageTemperature: number;

    @ApiProperty({
        description: 'Единица измерения объёма (штук, кг, литры и т.д.)',
        enum: VolumeUnit,
        example: VolumeUnit.KG,
    })
    @IsEnum(VolumeUnit)
    @IsNotEmpty()
    storateUnit: VolumeUnit;

    @ApiProperty({
        description: 'Признак, что товар продаётся с борта судна',
        example: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    saleFromShip: boolean;

    @ApiPropertyOptional({
        description: 'Название судна (если saleFromShip = true)',
        example: 'Рыболовецкое судно "Альбатрос"',
    })
    @IsString()
    @IsOptional()
    shipName: string;

    @ApiPropertyOptional({
        description: 'Порт прибытия (если saleFromShip = true)',
        example: 'Порт Владивосток',
    })
    @IsString()
    @IsOptional()
    arrivalPort: string;

    @ApiPropertyOptional({
        description: 'Дата прибытия (если saleFromShip = true)',
        example: '2025-02-10T08:00:00.000Z',
    })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    arrivalDate: Date;

    @ApiPropertyOptional({
        description: 'Дополнительные услуги, указываются идентификаторы',
        example: [1, 2, 3],
    })
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    additionalServices: number[];

    @ApiPropertyOptional({
        description: 'Комментарий к дополнительным услугам',
        example: 'Может потребоваться перегрузка на другой склад',
    })
    @IsString()
    @IsOptional()
    additionalServicesComment: string;

    // @ApiProperty({
    //     description: 'Дата обновления записи',
    //     example: '2025-01-02T12:00:00.000Z',
    // })
    // @Type(() => Date)
    // @IsDate()
    // @IsNotEmpty()
    // updatedAt: Date;
}

export class AuctionCreateParticipantDto {
    @ApiProperty({ example: 'company-123' })
    @IsString()
    companyId: string;
}

export class AuctionCreateDto {
    @ApiProperty({
        description: 'Тип аукциона (REGULAR, SPECIAL и т.д.)',
        example: AuctionType.REGULAR,
    })
    @IsEnum(AuctionType)
    @IsNotEmpty()
    type: AuctionType;

    @ApiProperty({
        description: 'Заголовок/название аукциона',
        example: 'Аукцион по продаже рыбы',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({
        description: 'ID компании, к которой относится аукцион',
        example: 'e18b81c0-4ada-468d-bd87-53d9b17348f0',
    })
    @IsUUID()
    @IsOptional()
    companyId?: string;

    @ApiProperty({
        description: 'Флаг: активен ли аукцион',
        example: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;

    @ApiProperty({
        description: 'Флаг: публичен ли аукцион',
        example: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    isPublic: boolean;

    @ApiPropertyOptional({
        description: 'Дата и время начала аукциона',
        example: '2025-02-10T08:00:00.000Z',
    })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    startsAt?: Date;

    @ApiProperty({
        description: 'Начальная цена',
        example: 10000,
    })
    @IsInt()
    @Min(0)
    @IsNotEmpty()
    initialPrice: number;

    @ApiProperty({
        description: 'Шаг цены (на сколько увеличивается цена за каждую ставку)',
        example: 500,
    })
    @IsInt()
    @Min(0)
    @IsNotEmpty()
    stepPrice: number;

    @ApiPropertyOptional({
        description: 'Цена выкупа (если участник хочет выкупить товар сразу)',
        example: 20000,
    })
    @IsInt()
    @Min(0)
    @IsOptional()
    buyoutPrice?: number;

    @ApiProperty({
        description: 'Продолжительность аукциона в часах',
        example: 24,
    })
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    auctionDuration: number;

    @ApiProperty({
        description: 'ID чата для участников аукциона',
        example: 'c2ed939d-7f03-45f9-a809-430293b0210e',
    })
    @IsUUID()
    @IsNotEmpty()
    chatroomId: string;

    @ApiPropertyOptional({
        description: 'ID последнего пользователя, сделавшего ставку (может быть null)',
        example: '3f9812fa-b08f-4f6b-a588-fcdca676b9cc',
    })
    @IsUUID()
    @IsOptional()
    lastStepPriceUserId?: string;

    @ApiProperty({ type: [AuctionCreatePositionDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AuctionCreatePositionDto)
    positions?: AuctionCreatePositionDto[];

    @ApiProperty({ type: [AuctionCreateParticipantDto] })
    @IsArray()
    participants?: AuctionCreateParticipantDto[];
}
