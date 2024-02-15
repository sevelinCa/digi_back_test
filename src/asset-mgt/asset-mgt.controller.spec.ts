import { Test, TestingModule } from '@nestjs/testing';
import { AssetMgtController } from './asset-mgt.controller';

describe('AssetMgtController', () => {
  let controller: AssetMgtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetMgtController],
    }).compile();

    controller = module.get<AssetMgtController>(AssetMgtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
