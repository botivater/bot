import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandAlias } from './commandAlias/commandAlias.entity';
import { CommandFlow } from './commandFlow/commandFlow.entity';
import { CommandFlowGroup } from './commandFlowGroup/commandFlowGroup.entity';
import { CommandInvocation } from './commandInvocation/commandInvocation.entity';
import { CommandList } from './commandList/commandList.entity';
import { EventFlow } from './eventFlow/eventFlow.entity';
import { EventFlowAction } from './eventFlowAction/eventFlowAction.entity';
import { EventFlowCondition } from './eventFlowCondition/eventFlowCondition.entity';
import { EventFlowTrigger } from './eventFlowTrigger/eventFlowTrigger.entity';
import { Guild } from './guild/guild.entity';
import { GuildChannel } from './guildChannel/guildChannel.entity';
import { GuildConfig } from './guildConfig/guildConfig.entity';
import { GuildMember } from './guildMember/guildMember.entity';
import { Message } from './message/message.entity';
import { Report } from './report/report.entity';
import { Tenant } from './tenant/tenant.entity';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        entities: [
          Guild,
          GuildMember,
          GuildChannel,
          GuildConfig,
          CommandList,
          CommandInvocation,
          CommandFlowGroup,
          CommandFlow,
          Report,
          EventFlow,
          EventFlowTrigger,
          EventFlowCondition,
          EventFlowAction,
          Tenant,
          User,
          Message,
          CommandAlias,
        ],
        url: configService.getOrThrow('DATABASE_URL'),
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class CommonModule {}
