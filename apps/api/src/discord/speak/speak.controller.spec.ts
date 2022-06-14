import { Test, TestingModule } from '@nestjs/testing';
import { SpeakController } from './speak.controller';
import { SpeakService } from './speak.service';

describe('SpeakController', () => {
  let controller: SpeakController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeakController],
      providers: [SpeakService],
    }).compile();

    controller = module.get<SpeakController>(SpeakController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
