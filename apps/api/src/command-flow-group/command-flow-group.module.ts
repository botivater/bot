import { forwardRef, Module } from '@nestjs/common';
import { CommandFlowGroupService } from './command-flow-group.service';
import { CommandFlowGroupController } from './command-flow-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandFlowGroup } from '@common/common/commandFlowGroup/commandFlowGroup.entity';
import { ApiModule } from '../api.module';
import { Guild } from '@common/common/guild/guild.entity';
import { CommandFlow } from '@common/common/commandFlow/commandFlow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guild, CommandFlow, CommandFlowGroup]),
    forwardRef(() => ApiModule),
  ],
  controllers: [CommandFlowGroupController],
  providers: [CommandFlowGroupService],
})
export class CommandFlowGroupModule {}
