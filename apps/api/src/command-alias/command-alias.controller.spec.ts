import { Test, TestingModule } from '@nestjs/testing';
import { CommandAliasController } from './command-alias.controller';
import { CommandAliasService } from './command-alias.service';

describe('CommandAliasController', () => {
  let controller: CommandAliasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandAliasController],
      providers: [CommandAliasService],
    }).compile();

    controller = module.get<CommandAliasController>(CommandAliasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
