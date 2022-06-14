import { Module } from '@nestjs/common';
import { GuildConfigService } from './guild-config.service';
import { GuildConfigController } from './guild-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuildConfig } from '@common/common/guildConfig/guildConfig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GuildConfig])],
  controllers: [GuildConfigController],
  providers: [GuildConfigService],
})
export class GuildConfigModule {}
