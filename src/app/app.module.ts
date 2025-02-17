import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from 'src/common/common.module';

import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { PrismaService } from 'src/common/services/prisma.service';
import { AuctionModule } from 'src/modules/auction/auction.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        TerminusModule,
        CommonModule,
        AuctionModule,
        ScheduleModule.forRoot(),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: join(__dirname, '../languages/'),
                watch: true,
            },
            resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
        }),
        ClientsModule.registerAsync([
            {
                name: 'AUTH_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [`${configService.get('rmq.uri')}`],
                        queue: `${configService.get('rmq.auth')}`,
                        queueOptions: {
                            durable: false,
                        },
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'POST_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [`${configService.get('rmq.uri')}`],
                        queue: `${configService.get('rmq.post')}`,
                        queueOptions: {
                            durable: false,
                        },
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'NOTIFICATION_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [`${configService.get('rmq.uri')}`],
                        queue: `${configService.get('rmq.notification')}`,
                        queueOptions: {
                            durable: false,
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [AppController],
    providers: [
        PrismaService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
    ],
})
export class AppModule {}
