import { Test, TestingModule } from '@nestjs/testing';
import { CommandInvocationController } from './command-invocation.controller';
import { CommandInvocationService } from './command-invocation.service';

describe('CommandInvocationController', () => {
  let controller: CommandInvocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandInvocationController],
      providers: [CommandInvocationService],
    }).compile();

    controller = module.get<CommandInvocationController>(CommandInvocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
