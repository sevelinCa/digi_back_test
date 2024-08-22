// import { Test, TestingModule } from "@nestjs/testing";
// import { QuotationsController } from "./quotations.controller";
// import { QuotationsService } from "./quotations.service";
// import { CreateQuotationDto } from "./dto/create-quotation.dto";
// import { UpdateQuotationDto } from "./dto/update-quotation.dto";
// import { QuotationEntity } from "./entities/quotation.entity";

// describe("QuotationsController", () => {
//   let controller: QuotationsController;
//   let service: QuotationsService;

//   const mockQuotationId = "d290f1ee-6c54-4b01-90e6-d701748f0851";
//   const mockOwnedDigifranchiseId = "b5b56f8d-70bc-48b1-b72f-2e31c7e8e5e9";

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [QuotationsController],
//       providers: [
//         {
//           provide: QuotationsService,
//           useValue: {
//             createQuotation: jest.fn(),
//             updateQuotation: jest.fn(),
//             deleteQuotation: jest.fn(),
//             getAllQuotations: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<QuotationsController>(QuotationsController);
//     service = module.get<QuotationsService>(QuotationsService);
//   });

//   it("should be defined", () => {
//     expect(controller).toBeDefined();
//   });

//   describe("create", () => {
//     it("should create a new quotation", async () => {
//       const createQuotationDto: CreateQuotationDto = {
//         ownedDigifranchiseId: mockOwnedDigifranchiseId,
//         digifranchiseUrl: "http://example.com",
//         quotationItems: [],
//       };
//       const quotation: QuotationEntity = {
//         id: mockQuotationId,
//         ownedDigifranchiseId: mockOwnedDigifranchiseId,
//         digifranchiseUrl: "http://example.com",
//         isOrdered: true,
//         quotationItems: [],
//       };
//       jest.spyOn(service, "createQuotation").mockResolvedValue(quotation);

//       expect(await controller.create(createQuotationDto)).toBe(quotation);
//       expect(service.createQuotation).toHaveBeenCalledWith(createQuotationDto);
//     });
//   });

//   describe("update", () => {
//     it("should update an existing quotation", async () => {
//       const updateQuotationDto: UpdateQuotationDto = {
//         digifranchiseUrl: "http://updated.com",
//         quotationItems: [],
//       };
//       const quotation: QuotationEntity = {
//         id: mockQuotationId,
//         ownedDigifranchiseId: mockOwnedDigifranchiseId,
//         digifranchiseUrl: "http://updated.com",
//         isOrdered: true,
//         quotationItems: [],
//       };
//       jest.spyOn(service, "updateQuotation").mockResolvedValue(quotation);

//       expect(await controller.update(mockQuotationId, updateQuotationDto)).toBe(
//         quotation
//       );
//       expect(service.updateQuotation).toHaveBeenCalledWith(
//         mockQuotationId,
//         updateQuotationDto
//       );
//     });
//   });

//   describe("remove", () => {
//     it("should delete a quotation", async () => {
//       jest.spyOn(service, "deleteQuotation").mockResolvedValue(undefined);

//       expect(await controller.remove(mockQuotationId)).toBeUndefined();
//       expect(service.deleteQuotation).toHaveBeenCalledWith(mockQuotationId);
//     });
//   });

//   describe("findAll", () => {
//     it("should return an array of quotations", async () => {
//       const quotations: QuotationEntity[] = [
//         {
//           id: mockQuotationId,
//           ownedDigifranchiseId: mockOwnedDigifranchiseId,
//           digifranchiseUrl: "http://example.com",
//           isOrdered: true,
//           quotationItems: [],
//         },
//       ];
//       jest.spyOn(service, "getAllQuotations").mockResolvedValue(quotations);

//       expect(await controller.findAll()).toBe(quotations);
//       expect(service.getAllQuotations).toHaveBeenCalled();
//     });
//   });
// });
