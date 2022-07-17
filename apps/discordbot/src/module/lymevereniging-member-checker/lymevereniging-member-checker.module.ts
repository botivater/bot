import { Module } from '@nestjs/common';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';
import { LymeverenigingMemberCheckerController } from './lymevereniging-member-checker.controller';
import { DiscordModule } from '../../discord/discord.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guild } from '@common/common/guild/guild.entity';
import { Feature } from '@common/common/feature/feature.entity';
import { FeatureConfig } from '@common/common/feature-config/feature-config.entity';
import { LymeverenigingGuildMember } from '@common/common/apps/lymevereniging-member-checker/entity/lymevereniging-guild-member.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';

@Module({
  imports: [
    DiscordModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      Guild,
      GuildMember,
      Feature,
      FeatureConfig,
      LymeverenigingGuildMember,
    ]),
  ],
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
    {
      provide: 'EMAILER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: 'emailer',
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
