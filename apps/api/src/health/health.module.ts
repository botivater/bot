import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DiscordBotHealthIndicator } from './discord-bot-health-indicator';
import { ApiModule } from '../api.module';

@Module({
  imports: [TerminusModule, HttpModule, forwardRef(() => ApiModule)],
  controllers: [HealthController],
  providers: [DiscordBotHealthIndicator],
})
export class HealthModule {}
