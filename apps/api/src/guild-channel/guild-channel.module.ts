import { Module } from '@nestjs/common';
import { GuildChannelService } from './guild-channel.service';
import { GuildChannelController } from './guild-channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuildChannel } from '@common/common/guildChannel/guildChannel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GuildChannel])],
  controllers: [GuildChannelController],
  providers: [GuildChannelService],
})
export class GuildChannelModule {}
