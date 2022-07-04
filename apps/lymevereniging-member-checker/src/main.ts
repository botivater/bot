import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LymeverenigingMemberCheckerModule } from './lymevereniging-member-checker.module';

async function bootstrap() {
  const rabbitmqURI = process.env.RABBITMQ_URI;
  if (!rabbitmqURI) throw new Error('RABBITMQ_URI is not set');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    LymeverenigingMemberCheckerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqURI],
        queue: 'lymevereniging-member-checker',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
