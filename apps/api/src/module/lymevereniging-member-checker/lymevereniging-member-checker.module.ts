import { Module } from '@nestjs/common';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';
import { LymeverenigingMemberCheckerController } from './lymevereniging-member-checker.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule],
  controllers: [LymeverenigingMemberCheckerController],
  providers: [
    {
      provide: 'LYMEVERENIGING_MEMBER_CHECKER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: 'lymevereniging-member-checker',
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
