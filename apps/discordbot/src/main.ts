import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DiscordBotModule } from './discord-bot/discord-bot.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DiscordBotModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'bot',
        protoPath: 'protobuf/bot/bot.proto',
      },
    },
  );
  await app.listen();
}
bootstrap();
