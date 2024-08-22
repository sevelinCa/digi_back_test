import { Test, TestingModule } from "@nestjs/testing";
import { QuotationsController } from "./quotations.controller";
import { QuotationsService } from "./quotations.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { QuotationEntity } from "./entities/quotation.entity";
import { QuotationRequest } from "./entities/quotation-request.entity";
import { DigifranchiseOwner } from "../digifranchise/entities/digifranchise-ownership.entity";
import { DigifranchiseProduct } from "../digifranchise/entities/digifranchise-product.entity";
import { DigifranchiseServiceOffered } from "../digifranchise/entities/digifranchise-service-offered.entity";
import { DigifranchiseService } from "../digifranchise/digifranchise.service";

describe("QuotationsController", () => {
  let controller: QuotationsController;
  let service: QuotationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotationsController],
      providers: [
        QuotationsService,
        {
          provide: getRepositoryToken(QuotationEntity),
          useValue: {}, // Mock the repository or use a mock function
        },
        {
          provide: getRepositoryToken(QuotationRequest),
          useValue: {}, // Mock the repository or use a mock function
        },
        {
          provide: getRepositoryToken(DigifranchiseOwner),
          useValue: {}, // Mock the repository or use a mock function
        },
        {
          provide: getRepositoryToken(DigifranchiseProduct),
          useValue: {}, // Mock the repository or use a mock function
        },
        {
          provide: getRepositoryToken(DigifranchiseServiceOffered),
          useValue: {}, // Mock the repository or use a mock function
        },
        {
          provide: DigifranchiseService,
          useValue: {}, // Mock the DigifranchiseService or use a mock function
        },
      ],
    }).compile();

    controller = module.get<QuotationsController>(QuotationsController);
    service = module.get<QuotationsService>(QuotationsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
