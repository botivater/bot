import { Module } from '@nestjs/common';
import { CommandInvocationService } from './command-invocation.service';
import { CommandInvocationController } from './command-invocation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandInvocation } from '@common/common/commandInvocation/commandInvocation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommandInvocation])],
  controllers: [CommandInvocationController],
  providers: [CommandInvocationService],
})
export class CommandInvocationModule {}
