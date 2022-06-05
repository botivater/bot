import { Test, TestingModule } from '@nestjs/testing';
import { AddRoleBuildingBlockService } from './add-role-building-block.service';

describe('AddRoleBuildingBlockService', () => {
  let service: AddRoleBuildingBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddRoleBuildingBlockService],
    }).compile();

    service = module.get<AddRoleBuildingBlockService>(
      AddRoleBuildingBlockService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
