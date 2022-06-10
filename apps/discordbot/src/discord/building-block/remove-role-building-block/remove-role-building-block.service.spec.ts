import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Discord } from '../../discord';
import { RemoveRoleBuildingBlockService } from './remove-role-building-block.service';

describe('RemoveRoleBuildingBlockService', () => {
  let removeRoleBuildingBlockService: RemoveRoleBuildingBlockService;
  let discordMock: Discord;

  const discordGuildMemberMockFactory = (id) => ({
    id,
    roles: {
      remove: jest.fn().mockImplementation(() => Promise.resolve()),
    },
  });

  const discordGuildRoleMockFactory = (id) => ({
    id,
  });

  const discordGuildMockFactory = (id) => {
    const _guildMembers = [];
    const _guildRoles = [];

    return {
      id,
      members: {
        fetch: jest.fn().mockImplementation(() => Promise.resolve()),
        cache: {
          get: jest.fn().mockImplementation((id) => {
            if (!_guildMembers.find((guild) => guild.id === id)) {
              _guildMembers.push(discordGuildMemberMockFactory(id));
            }
            return _guildMembers.find((guild) => guild.id === id);
          }),
        },
      },
      roles: {
        fetch: jest.fn().mockImplementation(() => Promise.resolve()),
        cache: {
          get: jest.fn().mockImplementation((id) => {
            if (!_guildRoles.find((guild) => guild.id === id)) {
              _guildRoles.push(discordGuildRoleMockFactory(id));
            }
            return _guildRoles.find((guild) => guild.id === id);
          }),
        },
      },
    };
  };

  const discordMockFactory = () => {
    const _guilds = [];

    return {
      guilds: {
        fetch: jest.fn().mockImplementation(() => Promise.resolve()),
        cache: {
          get: jest.fn().mockImplementation((id) => {
            if (!_guilds.find((guild) => guild.id === id)) {
              _guilds.push(discordGuildMockFactory(id));
            }
            return _guilds.find((guild) => guild.id === id);
          }),
        },
      },
    };
  };

  const discordFactory: Provider = {
    provide: Discord,
    useFactory: discordMockFactory,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveRoleBuildingBlockService, discordFactory],
    }).compile();
    module.useLogger(false);

    removeRoleBuildingBlockService = module.get<RemoveRoleBuildingBlockService>(
      RemoveRoleBuildingBlockService,
    );
    discordMock = module.get<Discord>(Discord);
  });

  it('should be defined', () => {
    expect(removeRoleBuildingBlockService).toBeDefined();
  });

  describe('handle', () => {
    it('should remove role from member', async () => {
      const guildSnowflake = '1';
      const guildMemberSnowflake = '2';
      const roleSnowflake = '3';

      await removeRoleBuildingBlockService.handle({
        guildSnowflake,
        guildMemberSnowflake,
        roleSnowflake,
      });

      expect(
        discordMock.guilds.cache
          .get(guildSnowflake)
          .members.cache.get(guildMemberSnowflake).roles.remove,
      ).toHaveBeenCalledWith(roleSnowflake);
    });
  });
});
