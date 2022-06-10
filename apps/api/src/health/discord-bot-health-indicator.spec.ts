import { Test, TestingModule } from '@nestjs/testing';
import { DiscordBotHealthIndicator } from './discord-bot-health-indicator';

describe('DiscordBotHealthIndicator', () => {
  let provider: DiscordBotHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordBotHealthIndicator],
    }).compile();

    provider = module.get<DiscordBotHealthIndicator>(DiscordBotHealthIndicator);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
