import { forwardRef, Module } from '@nestjs/common';
import { GuildRoleService } from './guild-role.service';
import { GuildRoleController } from './guild-role.controller';
import { ApiModule } from '../../api.module';

@Module({
  imports: [forwardRef(() => ApiModule)],
  controllers: [GuildRoleController],
  providers: [GuildRoleService],
})
export class GuildRoleModule {}
