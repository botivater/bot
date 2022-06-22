import { Module } from '@nestjs/common';
import { CommandAliasService } from './command-alias.service';
import { CommandAliasController } from './command-alias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandAlias } from '@common/common/commandAlias/commandAlias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommandAlias])],
  controllers: [CommandAliasController],
  providers: [CommandAliasService],
})
export class CommandAliasModule {}
