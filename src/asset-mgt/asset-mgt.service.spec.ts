import { Test, TestingModule } from '@nestjs/testing';
import { AssetMgtService } from './asset-mgt.service';

describe('AssetMgtService', () => {
  let service: AssetMgtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetMgtService],
    }).compile();

    service = module.get<AssetMgtService>(AssetMgtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
