import { Guild } from '@common/common/guild/guild.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandService } from '../../command/command.service';
import { BotService } from './bot.service';

describe('BotService', () => {
  let service: BotService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   imports: [TypeOrmModule.forFeature([Guild])],
    //   providers: [BotService, CommandService],
    // }).compile();
    // service = module.get<BotService>(BotService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
});
