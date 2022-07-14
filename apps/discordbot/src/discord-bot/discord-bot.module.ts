import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from '../discord/discord.module';
import { ModuleModule } from '../module/module.module';

@Module({
  imports: [ConfigModule.forRoot(), DiscordModule, ModuleModule],
})
export class DiscordBotModule {}
