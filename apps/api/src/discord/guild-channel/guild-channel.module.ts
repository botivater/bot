import { forwardRef, Module } from '@nestjs/common';
import { GuildChannelService } from './guild-channel.service';
import { GuildChannelController } from './guild-channel.controller';
import { ApiModule } from '../../api.module';

@Module({
  imports: [forwardRef(() => ApiModule)],
  controllers: [GuildChannelController],
  providers: [GuildChannelService],
})
export class GuildChannelModule {}
