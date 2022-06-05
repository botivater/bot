import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandFlow } from './commandFlow/commandFlow.entity';
import { CommandFlowGroup } from './commandFlowGroup/commandFlowGroup.entity';
import { CommandInvocation } from './commandInvocation/commandInvocation.entity';
import { CommandList } from './commandList/commandList.entity';
import { CommonService } from './common.service';
import { EventFlow } from './eventFlow/eventFlow.entity';
import { EventFlowAction } from './eventFlowAction/eventFlowAction.entity';
import { EventFlowCondition } from './eventFlowCondition/eventFlowCondition.entity';
import { EventFlowTrigger } from './eventFlowTrigger/eventFlowTrigger.entity';
import { Guild } from './guild/guild.entity';
import { GuildConfig } from './guildConfig/guildConfig.entity';
import { GuildMember } from './guildMember/guildMember.entity';
import { Report } from './report/report.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get('DATABASE_URL'),
        entities: [
          Guild,
          GuildMember,
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
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CommonService],
  exports: [CommonService, TypeOrmModule],
})
export class CommonModule {}
