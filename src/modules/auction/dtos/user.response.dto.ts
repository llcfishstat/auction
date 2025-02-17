import { Exclude } from 'class-transformer';

export class UserResponseDto {
    id: string;

    email: string;

    firstName: string;

    lastName: string;

    patronymic: string;

    phoneNumber: string;

    avatar: string;

    isEmailVerified: boolean;

    isPhoneVerified: boolean;

    public verification: string;

    verificationExpires: Date | null;

    loginAttempts: number;

    blockExpires: Date | null;

    role: string;

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date | null;

    companyId: string;

    @Exclude()
    password: string;
}
