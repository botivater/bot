import { CommonModule } from '@common/common';
import { Guild } from '@common/common/guild/guild.entity';
import { GuildConfig } from '@common/common/guildConfig/guildConfig.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityProvider } from './activity-provider';
import { Discord } from './discord';
import { MessageCreateEventService } from './event/message-create-event/message-create-event.service';
import { SyncProvider } from './sync-provider';
import { VoiceStateUpdateEventService } from './event/voice-state-update-event/voice-state-update-event.service';
import { GuildMemberAddEventService } from './event/guild-member-add-event/guild-member-add-event.service';
import { InteractionCreateEventService } from './event/interaction-create-event/interaction-create-event.service';
import { ReadyEventService } from './event/ready-event/ready-event.service';
import { CommandService } from './command/command.service';
import { PingCommandService } from './command/ping-command/ping-command.service';
import { CommandList } from '@common/common/commandList/commandList.entity';
import { DevCommandService } from './command/dev-command/dev-command.service';
import { ToneIndicatorCommandService } from './command/tone-indicator-command/tone-indicator-command.service';
import { FindAFriendCommandService } from './command/find-a-friend-command/find-a-friend-command.service';
import { HelpCommandService } from './command/help-command/help-command.service';
import { SetBirthdayCommandService } from './command/set-birthday-command/set-birthday-command.service';
import { ReportCommandService } from './command/report-command/report-command.service';
import { RecreateFlowsCommandService } from './command/recreate-flows-command/recreate-flows-command.service';
import { CommandFlow } from '@common/common/commandFlow/commandFlow.entity';
import { CommandFlowGroup } from '@common/common/commandFlowGroup/commandFlowGroup.entity';
import { Report } from '@common/common/report/report.entity';
import { LogUsageService } from './log-usage/log-usage.service';
import { CommandInvocation } from '@common/common/commandInvocation/commandInvocation.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { BirthdayService } from './birthday/birthday.service';
import { SyncService } from './sync/sync.service';
import { SystemMessageChannelService } from './message-channel/system-message-channel/system-message-channel.service';
import { InactiveUserService } from './inactive-user/inactive-user.service';
import { AddRoleBuildingBlockService } from './building-block/add-role-building-block/add-role-building-block.service';
import { RemoveRoleBuildingBlockService } from './building-block/remove-role-building-block/remove-role-building-block.service';
import { SendMessageBuildingBlockService } from './building-block/send-message-building-block/send-message-building-block.service';
import { MessageReactionEventService } from './event/message-reaction-event/message-reaction-event.service';
import { MessageReactionAddEventService } from './event/message-reaction-add-event/message-reaction-add-event.service';
import { MessageReactionRemoveEventService } from './event/message-reaction-remove-event/message-reaction-remove-event.service';
import { BotController } from './bot/bot.controller';
import { BotService } from './bot/bot/bot.service';
import { GenerateLoginService } from './command/generate-login/generate-login.service';
import { User } from '@common/common/user/user.entity';
import { Tenant } from '@common/common/tenant/tenant.entity';
import { GuildCreateEventService } from './event/guild-create-event/guild-create-event.service';
import { CoupleLoginService } from './command/couple-login/couple-login.service';
import { GuildChannel } from '@common/common/guildChannel/guildChannel.entity';
import { ChannelCreateEventService } from './event/channel-create-event/channel-create-event.service';
import { ChannelUpdateEventService } from './event/channel-update-event/channel-update-event.service';
import { ChannelDeleteEventService } from './event/channel-delete-event/channel-delete-event.service';
import { Message } from '@common/common/message/message.entity';
import { MessageUpdateEventService } from './event/message-update-event/message-update-event.service';
import { MessageDeleteEventService } from './event/message-delete-event/message-delete-event.service';
import { QAndAService } from './command/q-and-a/q-and-a.service';
import { AskAiService } from './command/ask-ai/ask-ai.service';

const discordFactory = {
  provide: Discord,
  useFactory: async (configService: ConfigService) => {
    const discord = new Discord(configService);
    await discord.setup();
    return discord;
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    TypeOrmModule.forFeature([
      Guild,
      GuildConfig,
      GuildMember,
      GuildChannel,
      CommandList,
      CommandFlowGroup,
      CommandFlow,
      Report,
      CommandInvocation,
      User,
      Tenant,
      Message,
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    discordFactory,
    MessageCreateEventService,
    ActivityProvider,
    SyncProvider,
    VoiceStateUpdateEventService,
    GuildMemberAddEventService,
    InteractionCreateEventService,
    ReadyEventService,
    CommandService,
    PingCommandService,
    DevCommandService,
    ToneIndicatorCommandService,
    FindAFriendCommandService,
    HelpCommandService,
    SetBirthdayCommandService,
    ReportCommandService,
    RecreateFlowsCommandService,
    LogUsageService,
    BirthdayService,
    SyncService,
    SystemMessageChannelService,
    InactiveUserService,
    AddRoleBuildingBlockService,
    RemoveRoleBuildingBlockService,
    SendMessageBuildingBlockService,
    MessageReactionEventService,
    MessageReactionAddEventService,
    MessageReactionRemoveEventService,
    BotService,
    GenerateLoginService,
    GuildCreateEventService,
    CoupleLoginService,
    ChannelCreateEventService,
    ChannelUpdateEventService,
    ChannelDeleteEventService,
    MessageUpdateEventService,
    MessageDeleteEventService,
    QAndAService,
    AskAiService,
  ],
  exports: [discordFactory],
  controllers: [BotController],
})
export class DiscordModule {}
