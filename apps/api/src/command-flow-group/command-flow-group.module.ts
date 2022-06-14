import { Module } from '@nestjs/common';
import { CommandFlowGroupService } from './command-flow-group.service';
import { CommandFlowGroupController } from './command-flow-group.controller';

@Module({
  controllers: [CommandFlowGroupController],
  providers: [CommandFlowGroupService]
})
export class CommandFlowGroupModule {}
