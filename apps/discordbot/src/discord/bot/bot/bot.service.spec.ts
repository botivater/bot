import { Guild } from '@common/common/guild/guild.entity';
import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommandService } from '../../command/command.service';
import { BotService } from './bot.service';

describe('BotService', () => {
  let botService: BotService;
  let commandService: CommandService;

  let mockGuilds: Guild[] = [];

  const mockGuildRepository = {
    find: jest.fn(),
    findOneBy: jest
      .fn()
      .mockImplementation((data: { id: number }) =>
        mockGuilds.find((g) => g.id === data.id),
      ),
  };

  const mockedCommandService: Provider = {
    provide: CommandService,
    useFactory: () => ({
      putGuildsCommands: jest.fn(),
      putGuildCommands: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotService,
        mockedCommandService,
        {
          provide: getRepositoryToken(Guild),
          useValue: mockGuildRepository,
        },
      ],
    }).compile();

    botService = module.get<BotService>(BotService);
    commandService = module.get<CommandService>(CommandService);

    mockGuilds = [];

    const guild = new Guild();
    guild.id = 1;
    guild.name = 'test';
    guild.snowflake = '123456789';
    mockGuilds.push(guild);
  });

  it('should be defined', () => {
    expect(botService).toBeDefined();
  });

  describe('loadAllGuildsCommands', () => {
    it('should return', async () => {
      jest.spyOn(commandService, 'putGuildsCommands').mockResolvedValue();

      expect(botService.loadAllGuildsCommands()).resolves.toBeUndefined();
    });

    it('should throw an error', async () => {
      jest
        .spyOn(commandService, 'putGuildsCommands')
        .mockRejectedValue(new Error());

      await expect(botService.loadAllGuildsCommands()).rejects.toThrow();
    });
  });

  describe('loadGuildCommands', () => {
    it('should return', async () => {
      jest.spyOn(commandService, 'putGuildCommands').mockResolvedValue();

      await expect(botService.loadGuildCommands(1)).resolves.toBeUndefined();
      expect(commandService.putGuildCommands).toHaveBeenCalledWith(
        mockGuilds[0],
      );
    });

    it('should throw an error', async () => {
      jest
        .spyOn(commandService, 'putGuildCommands')
        .mockRejectedValue(new Error());

      await expect(botService.loadGuildCommands(1)).rejects.toThrow();
    });

    it('should throw a not found error', async () => {
      await expect(botService.loadGuildCommands(2)).rejects.toThrow();
    });
  });
});
