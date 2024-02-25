import { Test, TestingModule } from '@nestjs/testing';
import { DigifranchiseService } from './digifranchise.service';

describe('DigifranchiseService', () => {
  let service: DigifranchiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DigifranchiseService],
    }).compile();

    service = module.get<DigifranchiseService>(DigifranchiseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
