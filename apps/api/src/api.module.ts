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
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
