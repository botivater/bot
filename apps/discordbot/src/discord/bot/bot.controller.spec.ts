import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BotController } from './bot.controller';
import { BotService, NotFoundError } from './bot/bot.service';
import { IBotService } from './interface/bot-service.interface';
import { LoadAllGuildsCommandsResponseError } from './interface/load-all-guilds-commands-response.interface';
import { LoadGuildCommandsResponseError } from './interface/load-guild-commands-response.interface';

describe('BotController', () => {
  let botService: IBotService;
  let botController: BotController;

  const mockedBotService: Provider = {
    provide: BotService,
    useFactory: () => {
      return new BotService(null, null);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockedBotService],
      controllers: [BotController],
    }).compile();
    module.useLogger(false);

    botService = module.get<BotService>(BotService);
    botController = module.get<BotController>(BotController);
  });

  it('should be defined', () => {
    expect(botController).toBeDefined();
  });

  describe('loadAllGuildsCommands', () => {
    it('should return a success response', async () => {
      jest.spyOn(botService, 'loadAllGuildsCommands').mockResolvedValue();
      const result = await botController.loadAllGuildsCommands(
        null,
        null,
        null,
      );

      expect(result.success).toBe(true);
      expect(result.error).toBe(LoadAllGuildsCommandsResponseError.NONE);
    });

    it('should return an error response', async () => {
      jest
        .spyOn(botService, 'loadAllGuildsCommands')
        .mockRejectedValue(new Error('Rejected value'));
      const result = await botController.loadAllGuildsCommands(
        null,
        null,
        null,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(LoadAllGuildsCommandsResponseError.UNKOWN);
    });
  });

  describe('loadGuildCommands', () => {
    it('should return a success response', async () => {
      jest.spyOn(botService, 'loadGuildCommands').mockResolvedValue();
      const result = await botController.loadGuildCommands(
        {
          id: 1,
        },
        null,
        null,
      );

      expect(result.success).toBe(true);
      expect(result.error).toBe(LoadGuildCommandsResponseError.NONE);
    });

    it('should return an error response', async () => {
      jest
        .spyOn(botService, 'loadGuildCommands')
        .mockRejectedValue(new Error('Rejected value'));
      const result = await botController.loadGuildCommands(
        {
          id: 1,
        },
        null,
        null,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(LoadGuildCommandsResponseError.UNKOWN);
    });

    it('should return a not found response', async () => {
      jest
        .spyOn(botService, 'loadGuildCommands')
        .mockRejectedValue(new NotFoundError('Not found'));
      const result = await botController.loadGuildCommands(
        {
          id: 1,
        },
        null,
        null,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(LoadGuildCommandsResponseError.NOT_FOUND);
    });
  });
});
