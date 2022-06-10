import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { Discord } from '../../discord';
import {
  SendMessageBuildingBlockService,
  SendMessageTo,
} from './send-message-building-block.service';

const moduleMocker = new ModuleMocker(global);

describe('SendMessageBuildingBlockService', () => {
  let sendMessageBuildingBlockService: SendMessageBuildingBlockService;
  let mockedDiscord: Discord;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendMessageBuildingBlockService],
    })
      .useMocker((token) => {
        if (token === Discord) {
          const _mockUsers = {};

          return {
            users: {
              fetch: jest.fn().mockImplementation(() => Promise.resolve()),
              cache: {
                get: jest.fn().mockImplementation((id) => {
                  if (!_mockUsers[id])
                    _mockUsers[id] = {
                      id,
                      send: jest
                        .fn()
                        .mockImplementation(() => Promise.resolve()),
                    };
                  return _mockUsers[id];
                }),
              },
            },
          };
        }

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    sendMessageBuildingBlockService =
      module.get<SendMessageBuildingBlockService>(
        SendMessageBuildingBlockService,
      );
    mockedDiscord = module.get<Discord>(Discord);
  });

  it('should be defined', () => {
    expect(sendMessageBuildingBlockService).toBeDefined();
  });

  describe('handle', () => {
    it('should send a message', async () => {
      const userSnowflake = '1';

      await sendMessageBuildingBlockService.handle({
        toType: SendMessageTo.USER,
        to: userSnowflake,
        messageFormat: 'Hello {{user}}',
        messageParameters: {
          user: 'John',
        },
      });

      expect(
        mockedDiscord.users.cache.get(userSnowflake).send,
      ).toHaveBeenCalledWith('Hello John');
    });
  });
});
