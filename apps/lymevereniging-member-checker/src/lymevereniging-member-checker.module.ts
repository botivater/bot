import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { LymeverenigingMemberCheckerController } from './lymevereniging-member-checker.controller';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [LymeverenigingMemberCheckerController],
  providers: [
    {
      provide: 'DISCORDBOT_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: 'discord_bot',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    LymeverenigingMemberCheckerService,
  ],
})
export class LymeverenigingMemberCheckerModule {}
