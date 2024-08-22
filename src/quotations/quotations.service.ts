import { DigifranchiseSubServices } from "src/digifranchise/entities/digifranchise-sub-service.entity";
import { DigifranchiseServiceCategory } from "src/digifranchise/entities/digifranchise-service-category.entity";
// import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { QuotationEntity } from "./entities/quotation.entity";
import { QuotationRequest } from "./entities/quotation-request.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
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

  private getQuotationItemWithName(quotationReq: QuotationRequest): any {
    if (!quotationReq) return null;
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
      provisionHours,
      price,
      email,
      fullName,
      ...productOrService
    } = createQuotationRequest;
    const digifranchiseOwned =
      await this.validateDigifranchiseOwner(ownedDigifranchiseId);
    if (!digifranchiseOwned) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, message: "Digifranchise not found" },
        404
      );
    }
    const providedProductOrService: {
      product: DigifranchiseProduct | null;
      service: DigifranchiseServiceOffered | null;
      serviceCategory: DigifranchiseServiceCategory | null;
      subService: DigifranchiseSubServices | null;
      subProduct: DigifranchiseSubProduct | null;
    } = {
      product: null,
      service: null,
      serviceCategory: null,
      subService: null,
      subProduct: null,
    };

    if (productOrService.product) {
      providedProductOrService.product = (await this.validateProduct(
        productOrService.product,
        this.digifranchiseProductRepository
      )) as DigifranchiseProduct;
    }
    if (productOrService.service) {
      providedProductOrService.service = await this.validateService(
        productOrService.service,
        this.digifranchiseServiceOfferedRepository
      );
    }
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
      provisionHours,
      price,
      email,
      fullName,
      digifranchiseUrl,
      ownedDigifranchiseId: digifranchiseOwned,
      ...(providedProductOrService as any),
    });
    const newQuotationRequest =
      await this.quotationRequestRepository.save(quotationRequest);
    console.log("quotationRequest", newQuotationRequest);
    return newQuotationRequest;
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
        message:
          "Quotation already sent to your Email, Kindly Check your email!",
        ...previousQuotationRequest,
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
      message: "Quotation sent to your Email, Kindly Check your email!",
      ...createdQuotation,
    };
  }

  async sendQuotationEmail(quotation: QuotationEntity) {
    const req = await this.getQuotationById(quotation.id);
    await this.mailService.sendQuotationEmail({
      to: req.quotationRequest.email,
      data: {
        quotation: {
          ...req,
          item: this.getQuotationItemWithName(req.quotationRequest),
        },
      },
    });
  }
  private async validateDigifranchiseOwner(
    ownedDigifranchiseId: string
  ): Promise<DigifranchiseOwner> {
    const digifranchiseOwned = await this.digifranchiseOwnerRepository.findOne({
      where: { id: ownedDigifranchiseId },
    });
    if (!digifranchiseOwned) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, message: "Digifranchise not found" },
        404
      );
    }

    return digifranchiseOwned;
  }

  // validating the service
  private async validateService(
    serviceId: string | undefined,
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
  // validating Product
  private async validateProduct(
    productId: string | undefined,
    productRepo: Repository<DigifranchiseProduct | DigifranchiseSubProduct>
  ): Promise<DigifranchiseProduct | DigifranchiseSubProduct | null> {
    if (!productId) return null;
    const product = await productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, message: "Product not found" },
        404
      );
    }
    return product;
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
      relations: ["ownedDigifranchiseId"],
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
