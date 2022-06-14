import { Module } from '@nestjs/common';
import { CommandInvocationService } from './command-invocation.service';
import { CommandInvocationController } from './command-invocation.controller';

@Module({
  controllers: [CommandInvocationController],
  providers: [CommandInvocationService]
})
export class CommandInvocationModule {}
