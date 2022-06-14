import { Test, TestingModule } from '@nestjs/testing';
import { CommandInvocationService } from './command-invocation.service';

describe('CommandInvocationService', () => {
  let service: CommandInvocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandInvocationService],
    }).compile();

    service = module.get<CommandInvocationService>(CommandInvocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
