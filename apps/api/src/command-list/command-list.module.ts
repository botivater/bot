import { Module } from '@nestjs/common';
import { CommandListService } from './command-list.service';
import { CommandListController } from './command-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandList } from '@common/common/commandList/commandList.entity';
import { Guild } from '@common/common/guild/guild.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommandList, Guild])],
  controllers: [CommandListController],
  providers: [CommandListService],
})
export class CommandListModule {}
