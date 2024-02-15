import { Test, TestingModule } from '@nestjs/testing';
import { DigifranchiseController } from './digifranchise.controller';

describe('DigifranchiseController', () => {
  let controller: DigifranchiseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DigifranchiseController],
    }).compile();

    controller = module.get<DigifranchiseController>(DigifranchiseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
