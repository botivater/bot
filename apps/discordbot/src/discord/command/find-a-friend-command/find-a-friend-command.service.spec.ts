import { Test, TestingModule } from '@nestjs/testing';
import { FindAFriendCommandService } from './find-a-friend-command.service';

describe('FindAFriendCommandService', () => {
  let service: FindAFriendCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAFriendCommandService],
    }).compile();

    service = module.get<FindAFriendCommandService>(FindAFriendCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
