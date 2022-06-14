import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { HealthModule } from './health/health.module';
import { GuildModule } from './guild/guild.module';
import { CommonModule } from '@common/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TenantModule } from './tenant/tenant.module';
import { GuildMemberModule } from './guild-member/guild-member.module';
import { GuildConfigModule } from './guild-config/guild-config.module';
import { CommandListModule } from './command-list/command-list.module';
import { CommandInvocationModule } from './command-invocation/command-invocation.module';
import { CommandFlowGroupModule } from './command-flow-group/command-flow-group.module';
import { ReportModule } from './report/report.module';
import { GuildChannelModule as DiscordGuildChannelModule } from './discord/guild-channel/guild-channel.module';
import { GuildMemberModule as DiscordGuildMemberModule } from './discord/guild-member/guild-member.module';
import { GuildRoleModule as DiscordGuildRoleModule } from './discord/guild-role/guild-role.module';
import { SpeakModule } from './discord/speak/speak.module';
import { LoadGuildCommandsModule } from './discord/load-guild-commands/load-guild-commands.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    ClientsModule.register([
      {
        name: 'BOT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'bot',
          protoPath: 'protobuf/bot/bot.proto',
        },
      },
    ]),
    forwardRef(() => HealthModule),
    GuildModule,
    AuthModule,
    UserModule,
    TenantModule,
    GuildMemberModule,
    GuildConfigModule,
    CommandListModule,
    CommandInvocationModule,
    CommandFlowGroupModule,
    ReportModule,
    DiscordGuildChannelModule,
    DiscordGuildMemberModule,
    DiscordGuildRoleModule,
    SpeakModule,
    LoadGuildCommandsModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
