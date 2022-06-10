import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { HealthModule } from './health/health.module';
import { GuildModule } from './guild/guild.module';

@Module({
  imports: [
    forwardRef(() => HealthModule),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.getOrThrow('DATABASE_URL'),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
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
    GuildModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
