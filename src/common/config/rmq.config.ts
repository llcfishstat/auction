import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs(
  'rmq',
  (): Record<string, unknown> => ({
    uri: process.env.RABBITMQ_URL,
    auth: process.env.RABBITMQ_AUTH_QUEUE,
    auction: process.env.RABBITMQ_AUCTION_QUEUE,
    post: process.env.RABBITMQ_POST_QUEUE,
    notification: process.env.RABBITMQ_NOTIFICATION_QUEUE
  }),
);
