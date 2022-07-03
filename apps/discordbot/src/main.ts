import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DiscordBotModule } from './discord-bot/discord-bot.module';

async function bootstrap() {
  const rabbitmqURI = process.env.RABBITMQ_URI;
  if (!rabbitmqURI) throw new Error('RABBITMQ_URI is not set');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DiscordBotModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqURI],
        queue: 'discord_bot',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
