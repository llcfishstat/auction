export class CompanyResponseDto {
    id: string;

    directorFirstName: string;

    directorLastName: string;

    directorPatronymic?: string;

    inn: string;

    ogrn: string;

    organizationName: string;

    country: string;

    city: string;

    legalAddress?: string;

    email?: string;

    phone?: string;

    description?: string;

    documentUrl?: string;

    logoUrl?: string;

    status: string;

    createdAt: Date;

    updatedAt: Date;
}
