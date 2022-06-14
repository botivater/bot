import { forwardRef, Module } from '@nestjs/common';
import { LoadGuildCommandsService } from './load-guild-commands.service';
import { LoadGuildCommandsController } from './load-guild-commands.controller';
import { ApiModule } from '../../api.module';

@Module({
  imports: [forwardRef(() => ApiModule)],
  controllers: [LoadGuildCommandsController],
  providers: [LoadGuildCommandsService],
})
export class LoadGuildCommandsModule {}
