import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { DiscordBotHealthIndicator } from './discord-bot-health-indicator';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  /**
   *
   */
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private discordBot: DiscordBotHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.discordBot.isHealthy('discord-bot'),
    ]);
  }
}
