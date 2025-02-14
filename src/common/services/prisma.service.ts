import { Injectable, OnModuleInit } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();

        this.$use(async (params, next) => {
            const readActions: Prisma.PrismaAction[] = ['findUnique', 'findFirst', 'findMany', 'aggregate', 'count'];

            if (params.model && readActions.includes(params.action)) {
                params.args = params.args || {};

                if (params.args.where) {
                    if (params.args.where.deletedAt === undefined) {
                        params.args.where = {
                            ...params.args.where,
                            deletedAt: null,
                        };
                    }
                } else {
                    params.args.where = { deletedAt: null };
                }
            }
            return next(params);
        });
    }

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            await this.$queryRaw`SELECT 1`;
            return Promise.resolve({
                prisma: {
                    status: 'up',
                },
            });
        } catch (error) {
            console.error(error);
            return Promise.resolve({
                prisma: {
                    status: 'down',
                },
            });
        }
    }
}
