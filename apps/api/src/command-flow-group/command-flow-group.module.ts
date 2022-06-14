import { Module } from '@nestjs/common';
import { CommandFlowGroupService } from './command-flow-group.service';
import { CommandFlowGroupController } from './command-flow-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandFlowGroup } from '@common/common/commandFlowGroup/commandFlowGroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommandFlowGroup])],
  controllers: [CommandFlowGroupController],
  providers: [CommandFlowGroupService],
})
export class CommandFlowGroupModule {}
