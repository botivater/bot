import { CommandFlow } from './libs/common/src/commandFlow/commandFlow.entity';
import { CommandFlowGroup } from './libs/common/src/commandFlowGroup/commandFlowGroup.entity';
import { CommandInvocation } from './libs/common/src/commandInvocation/commandInvocation.entity';
import { CommandList } from './libs/common/src/commandList/commandList.entity';
import { Guild } from './libs/common/src/guild/guild.entity';
import { GuildConfig } from './libs/common/src/guildConfig/guildConfig.entity';
import { GuildMember } from './libs/common/src/guildMember/guildMember.entity';
import { GuildChannel } from './libs/common/src/guildChannel/guildChannel.entity';
import { Report } from './libs/common/src/report/report.entity';
import { EventFlow } from './libs/common/src/eventFlow/eventFlow.entity';
import { EventFlowTrigger } from './libs/common/src/eventFlowTrigger/eventFlowTrigger.entity';
import { EventFlowCondition } from './libs/common/src/eventFlowCondition/eventFlowCondition.entity';
import { EventFlowAction } from './libs/common/src/eventFlowAction/eventFlowAction.entity';
import { Tenant } from './libs/common/src/tenant/tenant.entity';
import { User } from './libs/common/src/user/user.entity';
import { Message } from './libs/common/src/message/message.entity';
import { CommandAlias } from './libs/common/src/commandAlias/commandAlias.entity';
import { OpenAIUsage } from './libs/common/src/openAIUsage/openAIUsage.entity';
import { EmailConfig } from './libs/common/src/emailConfig/emailConfig.entity';
import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  url: process.env.DATABASE_URL,
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
    OpenAIUsage,
    EmailConfig,
  ],
  migrations: [`${__dirname}/migrations/*.ts`],
});
