import { DigifranchiseSubServices } from "src/digifranchise/entities/digifranchise-sub-service.entity";
import { DigifranchiseServiceCategory } from "src/digifranchise/entities/digifranchise-service-category.entity";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { QuotationEntity } from "./entities/quotation.entity";
import { QuotationRequest } from "./entities/quotation-request.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository, ObjectLiteral, Equal } from "typeorm";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { CreateQuotationDto } from "./dto/create-quotation.dto";
import { UpdateQuotationDto } from "./dto/update-quotation.dto";
import { DigifranchiseProduct } from "src/digifranchise/entities/digifranchise-product.entity";
import { DigifranchiseServiceOffered } from "src/digifranchise/entities/digifranchise-service-offered.entity";
import { CreateQuotationRequestDto } from "./dto/create-quotation-request.dto";
import { MailService } from "src/mail/mail.service";
import { DigifranchiseSubProduct } from "src/digifranchise/entities/digifranchise-sub-product.entity";
import { RateTable } from "src/payment/entities/tax-rate.entity";
import { QuotationWithMessage } from "./dto/create-quotation.dto";

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(DigifranchiseServiceCategory)
    private readonly digifranchiseServiceCategoryRepository: Repository<DigifranchiseServiceCategory>,
    @InjectRepository(DigifranchiseSubServices)
    private readonly digifranchiseSubServicesRepository: Repository<DigifranchiseSubServices>,
    @InjectRepository(DigifranchiseSubProduct)
    private readonly digifranchiseSubProductRepository: Repository<DigifranchiseSubProduct>,

    @InjectRepository(QuotationEntity)
    private readonly quotationRepository: Repository<QuotationEntity>,

    @InjectRepository(QuotationRequest)
    private readonly quotationRequestRepository: Repository<QuotationRequest>,

    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(DigifranchiseProduct)
    private readonly digifranchiseProductRepository: Repository<DigifranchiseProduct>,
    @InjectRepository(DigifranchiseServiceOffered)
    private readonly digifranchiseServiceOfferedRepository: Repository<DigifranchiseServiceOffered>,

    @InjectRepository(RateTable)
    private readonly rateTableRepository: Repository<RateTable>,
    private readonly mailService: MailService
  ) {}

  private getQuotationItemWithName(quotationReq: QuotationRequest) {
    if (quotationReq.product) {
      return {
        ...quotationReq.product,
        name: quotationReq.product.productName,
      };
    }
    if (quotationReq.service) {
      return {
        ...quotationReq.service,
        name: quotationReq.service.serviceName,
      };
    }
    if (quotationReq.serviceCategory) {
      return {
        ...quotationReq.serviceCategory,
        name: quotationReq.serviceCategory.serviceCategoryName,
      };
    }

    if (quotationReq.subService) {
      return {
        ...quotationReq.subService,
        name: quotationReq.subService.serviceName,
      };
    }

    if (quotationReq.subProduct) {
      return {
        ...quotationReq.subProduct,
        name: quotationReq.subProduct.productName,
      };
    }

    return null;
  }
  async createQuotationRequest(
    createQuotationRequest: CreateQuotationRequestDto
  ) {
    const {
      digifranchiseUrl,
      ownedDigifranchiseId,
      quantity,
      expiryDate,
      price,
      email,
      fullName,
      otherInfo,
      ...productOrService
    } = createQuotationRequest;

    const digiOwned = await this.validateDigifranchiseOwner(
      ownedDigifranchiseId,
      productOrService
    );

    const { digifranchiseOwned, ...digifranchiseProductOrService } = digiOwned;

    const providedProductOrService: {
      serviceCategory: DigifranchiseServiceCategory | null;
      subService: DigifranchiseSubServices | null;
      subProduct: DigifranchiseSubProduct | null;
    } = {
      serviceCategory: null,
      subService: null,
      subProduct: null,
    };

    if (productOrService.serviceCategory) {
      providedProductOrService.serviceCategory = await this.validateService(
        productOrService.serviceCategory,
        this.digifranchiseServiceCategoryRepository
      );
    }

    if (productOrService.subService) {
      providedProductOrService.subService = await this.validateService(
        productOrService.subService,
        this.digifranchiseSubServicesRepository
      );
    }

    if (productOrService.subProduct) {
      providedProductOrService.subProduct = await this.validateService(
        productOrService.subProduct,
        this.digifranchiseSubProductRepository
      );
    }
    const quotationRequest = this.quotationRequestRepository.create({
      quantity,
      expiryDate,
      price,
      email,
      fullName,
      digifranchiseUrl,
      otherInfo,
      ownedDigifranchiseId: digifranchiseOwned,
      ...digifranchiseProductOrService,
      ...(providedProductOrService as any),
    });
    const newQuotationRequest =
      await this.quotationRequestRepository.save(quotationRequest);
    const sendQuotation = (await this.quotationRequestRepository.findOne({
      where: {
        id: Equal((newQuotationRequest as any).id),
      },
      relations: [
        "ownedDigifranchiseId",
        "product",
        "service",
        "subService",
        "serviceCategory",
        "subProduct",
      ],
    })) as QuotationRequest;
    await this.notifyDigifranchiseOwner(sendQuotation);
    return {
      message: "Quotation Request sent successfully!",
      data: newQuotationRequest,
    };
  }

  async notifyDigifranchiseOwner(quotationRequest: QuotationRequest) {
    const requestData = this.getQuotationItemWithName(quotationRequest);
    await this.mailService.quotationRequestNotification({
      to: quotationRequest.ownedDigifranchiseId.userEmail,
      data: {
        request: { ...quotationRequest, name: requestData?.name },
      },
    });
  }
  async sendQuotationEmail(quotation: QuotationEntity) {
    const req = await this.getQuotationById(quotation.id);
    await this.mailService.sendQuotationEmail({
      to: req.quotationRequest.email,
      data: {
        quotation: {
          ...req,
          url: `${req.quotationRequest.digifranchiseUrl}&quotationId=${req.id}`,
          item: this.getQuotationItemWithName(req.quotationRequest),
        },
      },
    });
  }

  async findAllRequests() {
    const quotationRequests = await this.quotationRequestRepository.find({
      relations: [
        "ownedDigifranchiseId",
        "product",
        "service",
        "subService",
        "serviceCategory",
        "subProduct",
      ],
    });
    return {
      message: "All Quotation requests retrieved successfully!",
      data: quotationRequests,
    };
  }

  async createQuotation(
    createQuotationDto: CreateQuotationDto
  ): Promise<QuotationEntity | QuotationWithMessage> {
    const { quotationRequest } = createQuotationDto;
    const pendingQuotationRequest =
      await this.quotationRequestRepository.findOne({
        where: { id: quotationRequest },
        relations: ["ownedDigifranchiseId"],
      });
    if (!pendingQuotationRequest) {
      throw new NotFoundException(
        "No Quotation Request referencing the provided Id found!"
      );
    }
    const previousQuotationRequest = await this.quotationRepository.findOne({
      where: { quotationRequest: { id: quotationRequest } },
      relations: [
        "quotationRequest",
        "quotationRequest.ownedDigifranchiseId",
        "quotationRequest.product",
        "quotationRequest.service",
        "quotationRequest.subService",
        "quotationRequest.serviceCategory",
        "quotationRequest.subProduct",
      ],
    });

    if (previousQuotationRequest) {
      await this.sendQuotationEmail(previousQuotationRequest);
      return {
        message: "Quotation already sent!",
        data: previousQuotationRequest,
      };
    }
    const taxRate =
      ((
        await this.rateTableRepository.findOne({
          where: { rateName: "VAT", deleteAt: IsNull() },
        })
      )?.rateNumber as number) ?? 0;
    const newQuotation = this.quotationRepository.create({
      isOrdered: createQuotationDto.isOrdered,
      provisionHours: createQuotationDto.provisionHours,

      quotationRequest: pendingQuotationRequest,
      taxAmount:
        pendingQuotationRequest.price *
        pendingQuotationRequest.quantity *
        (taxRate / 100),
      totalPrice:
        pendingQuotationRequest.price * pendingQuotationRequest.quantity,
    });
    const createdQuotation = await this.quotationRepository.save(newQuotation);
    await this.sendQuotationEmail(createdQuotation);

    return {
      message: "Quotation email sent!",
      data: createdQuotation,
    };
  }

  private async validateDigifranchiseOwner(
    ownedDigifranchiseId: string,
    productOrService: any
  ): Promise<any> {
    if (!ownedDigifranchiseId || !productOrService) return null;
    const providedProductOrService: {
      product: DigifranchiseProduct | null;
      service: DigifranchiseServiceOffered | null;
    } = {
      product: null,
      service: null,
    };

    const ownedDigifranchise = await this.digifranchiseOwnerRepository.findOne({
      where: { id: Equal(ownedDigifranchiseId) },
      relations: ["digifranchise"],
    });
    if (!ownedDigifranchise) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, message: "Digifranchise not found" },
        404
      );
    }

    if (productOrService.product) {
      const products = await this.digifranchiseProductRepository.findBy({
        digifranchiseId: Equal(ownedDigifranchise.digifranchise.id),
      });
      if (!products) throw new NotFoundException("Products Not Found!");
      const product = products.find((p) => p.id === productOrService.product);
      if (!product) throw new NotFoundException("Product Not found!");
      providedProductOrService.product = product;
    }
    if (productOrService.service) {
      const services = await this.digifranchiseServiceOfferedRepository.findBy({
        digifranchiseId: Equal(ownedDigifranchise.digifranchise.id),
      });

      if (!services) throw new NotFoundException("Services Not Found!");
      const service = services.find((s) => s.id === productOrService.service);
      if (!service) throw new NotFoundException("Service Not Found!");
      providedProductOrService.service = service;
    }

    return {
      digifranchiseOwned: ownedDigifranchise,
      ...providedProductOrService,
    };
  }

  // validating the service
  private async validateService(
    serviceId: string,
    serviceRepo: Repository<any>
  ): Promise<any> {
    if (!serviceId) return null;
    const service = await serviceRepo.findOne({
      where: { id: serviceId },
    });

    if (!service) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, message: "Service not found" },
        404
      );
    }

    return service;
  }

  // validate quotation Request
  async validateQuotationRequest(id: string): Promise<QuotationRequest | null> {
    if (!id) return null;
    const quotationRequest = await this.quotationRequestRepository.findOne({
      where: { id },
    });
    return quotationRequest;
  }
  async getQuotationRequestById(id: string): Promise<QuotationRequest> {
    const quotationRequest = await this.quotationRequestRepository.findOne({
      where: { id },
      relations: [
        "ownedDigifranchiseId",
        "product",
        "service",
        "subProduct",
        "subService",
        "serviceCategory",
      ],
    });

    if (!quotationRequest) {
      throw new NotFoundException("Quotation Request not found");
    }

    return quotationRequest;
  }
  async getQuotationRequestByDigifranchiseId(
    id: string
  ): Promise<QuotationRequest[]> {
    const quotationRequest = await this.quotationRequestRepository.find({
      where: { ownedDigifranchiseId: { id } },
      relations: ["ownedDigifranchiseId"],
    });

    if (!quotationRequest) {
      throw new NotFoundException("Quotation Request not found");
    }

    return quotationRequest;
  }
  async getQuotationRequests(): Promise<QuotationRequest[]> {
    const quotationRequests = await this.quotationRequestRepository.find({
      relations: [
        "ownedDigifranchiseId",
        "product",
        "service",
        "subService",
        "serviceCategory",
        "subProduct",
      ],
    });
    return quotationRequests;
  }
  async updateQuotation(
    id: string,
    updateQuotationDto: UpdateQuotationDto
  ): Promise<QuotationEntity> {
    const existingQuotation = await this.getQuotationById(id);

    const { quotationRequest, isOrdered } = updateQuotationDto;

    if (isOrdered) existingQuotation.isOrdered = isOrdered;

    if (quotationRequest) {
      const existingRequest = await this.quotationRequestRepository.findOne({
        where: { id: quotationRequest },
      });
      if (!existingRequest) {
        throw new NotFoundException(
          "Quotation Request not found with the provided id"
        );
      }
      await this.quotationRequestRepository.update(
        { id: quotationRequest },
        { quotation: existingQuotation }
      );
    }

    const updatedQuotation =
      await this.quotationRepository.save(existingQuotation);
    return updatedQuotation;
  }

  // delete a quotation
  async deleteQuotation(id: string): Promise<void> {
    const quotation = await this.quotationRepository.findOne({ where: { id } });
    if (!quotation) {
      throw new NotFoundException("Quotation not found with the provided id");
    }
    await this.quotationRequestRepository.delete({ quotation: { id } });
    await this.quotationRepository.remove(quotation);
  }

  async getAllQuotations(): Promise<QuotationEntity[]> {
    const quotations = await this.quotationRepository.find({
      relations: [
        "quotationRequest",
        "quotationRequest.ownedDigifranchiseId",
        "quotationRequest.product",
        "quotationRequest.service",
        "quotationRequest.subService",
        "quotationRequest.serviceCategory",
        "quotationRequest.subProduct",
      ],
    });
    const req = await this.quotationRequestRepository.find({
      where: {
        quotation: Not(IsNull()),
      },
      relations: ["ownedDigifranchiseId"],
    });

    return quotations;
  }
  //  get a single quotation
  async getQuotationById(id: string): Promise<QuotationEntity> {
    const quotation = await this.quotationRepository.findOne({
      where: { id },
      relations: [
        "quotationRequest",
        "quotationRequest.ownedDigifranchiseId",
        "quotationRequest.product",
        "quotationRequest.service",
        "quotationRequest.subService",
        "quotationRequest.subProduct",
        "quotationRequest.serviceCategory",
      ],
    });

    if (!quotation) {
      throw new NotFoundException("Quotation not found");
    }

    return quotation;
  }
}
