import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EmailerModule } from './emailer.module';

async function bootstrap() {
  const rabbitmqURI = process.env.RABBITMQ_URI;
  if (!rabbitmqURI) throw new Error('RABBITMQ_URI is not set');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmailerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqURI],
        queue: 'emailer',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
