import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuctionService } from './services/auction.service';
import { AuctionController } from './controllers/auction.controller';
import { PrismaService } from 'src/common/services/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [AuctionController],
  imports: [
    ConfigModule,
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
    ]),
  ],
  providers: [PrismaService, AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
