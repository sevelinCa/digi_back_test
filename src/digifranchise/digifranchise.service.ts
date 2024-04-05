import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service-offered.entity';
import { checkIfDigifranchiseExists } from 'src/helper/FindByFunctions';
import { CreateDigifranchiseSubServiceOfferedDto, UpdateDigifranchiseSubServiceDto } from './dto/create-digifranchise-SubServiceOffered.dto';
import { DigifranchiseSubServices } from './entities/digifranchise-sub-service.entity';
import { CreateDigifranchiseDto } from './dto/create-digifranchise.dto';
import { DigifranchiseGeneralInfo } from './entities/digifranchise-general-information.entity';
import { DigifranchiseComplianceInfo } from './entities/digifranchise-compliance-information.entity';
import { DigifranchiseProfessionalBodyMembership } from './entities/digifranchise-professional-body-membership.entity';
import { ProductService } from './product.service';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { DigifranchiseGalleryImage } from './entities/digifranchise-gallery-images.entity';
import { DigifranchiseServiceCategory } from './entities/digifranchise-service-category.entity';
import { DigifranchiseSelectProductOrServiceTable } from './entities/digifranchise-select-product-service.entity';
@Injectable()
export class DigifranchiseService {
  constructor(
    private readonly productService: ProductService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DigifranchiseOwner)
    private digifranchiseOwnershipRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(Digifranchise)
    private digifranchiseRepository: Repository<Digifranchise>,
    @InjectRepository(DigifranchiseServiceOffered)
    private readonly digifranchiseServiceOfferedRepository: Repository<DigifranchiseServiceOffered>,
    @InjectRepository(DigifranchiseGeneralInfo)
    private readonly digifranchiseGeneralInfoRepository: Repository<DigifranchiseGeneralInfo>,
    @InjectRepository(DigifranchiseComplianceInfo)
    private readonly digifranchiseComplianceInfoRepository: Repository<DigifranchiseComplianceInfo>,
    @InjectRepository(DigifranchiseSubServices)
    private readonly digifranchiseSubServiceOfferedRepository: Repository<DigifranchiseSubServices>,
    @InjectRepository(DigifranchiseProfessionalBodyMembership)
    private readonly digifranchiseProfessionalBodyMembershipRepository: Repository<DigifranchiseProfessionalBodyMembership>,
    @InjectRepository(DigifranchiseProduct)
    private digifranchiseProductRepository: Repository<DigifranchiseProduct>,
    @InjectRepository(DigifranchiseServiceCategory)
    private digifranchiseServiceCategoryRepository: Repository<DigifranchiseServiceCategory>,
    @InjectRepository(DigifranchiseGalleryImage)
    private digifranchiseGalleryImageRepository: Repository<DigifranchiseGalleryImage>,
    @InjectRepository(DigifranchiseSelectProductOrServiceTable)
    private readonly digifranchiseSelectItemRepository: Repository<DigifranchiseSelectProductOrServiceTable>,

  ) { }

  async createDigifranchise(createDigifranchiseDto: CreateDigifranchiseDto): Promise<Digifranchise> {
    const newDigifranchise = this.digifranchiseRepository.create(createDigifranchiseDto);
    return this.digifranchiseRepository.save(newDigifranchise);
  }

  async findAllDigifranchise(): Promise<Digifranchise[]> {
    return await this.digifranchiseRepository.find();
  }

  async ownDigifranchise(userId: string, digifranchiseId: string): Promise<DigifranchiseOwner> {
    const existingOwnership = await this.digifranchiseOwnershipRepository.findOne({ where: { userId, digifranchiseId: Equal(digifranchiseId) } });
    if (existingOwnership) {
      throw new Error('User already own this digifranchise');
    }

    const digifranchiseExists = await checkIfDigifranchiseExists(this.digifranchiseRepository, digifranchiseId);
    if (!digifranchiseExists) {
      throw new Error('Digifranchise not found');
    }

    const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } });
    if (!digifranchise) {
      throw new Error('Digifranchise not found');
    }

    const newFranchiseOwner = this.digifranchiseOwnershipRepository.create({
      userId,
      digifranchiseId: digifranchiseId,
      digifranchise: digifranchise,
    });

    const savedFranchiseOwner = await this.digifranchiseOwnershipRepository.save(newFranchiseOwner);

    const products = await this.digifranchiseProductRepository.find({ where: { digifranchiseId: Equal(digifranchiseId) } });
    const services = await this.digifranchiseServiceOfferedRepository.find({ where: { digifranchiseId: Equal(digifranchiseId) } });

    for (const product of products) {
      const ownedProduct = this.digifranchiseProductRepository.create({
        productName: product.productName,
        description: product.description,
        unitPrice: product.unitPrice,
      });
      await this.digifranchiseProductRepository.save(ownedProduct);
    }

    for (const service of services) {
      const ownedService = this.digifranchiseServiceOfferedRepository.create({
        serviceName: service.serviceName,
        description: service.description,
        unitPrice: service.unitPrice,
      });
      await this.digifranchiseServiceOfferedRepository.save(ownedService);

      const serviceCategories = await this.digifranchiseServiceCategoryRepository.find({
        where: { service: Equal(service.id) },
      });
      for (const category of serviceCategories) {
        const ownedServiceCategory = this.digifranchiseServiceCategoryRepository.create({
          serviceCategoryName: category.serviceCategoryName,
          unitPrice: category.unitPrice,
          description: category.description,
        });
        await this.digifranchiseServiceCategoryRepository.save(ownedServiceCategory);
      }

      const serviceGalleryImages = await this.digifranchiseGalleryImageRepository.find({
        where: { digifranchiseServiceId: Equal(service.id) },
      });
      for (const image of serviceGalleryImages) {
        const ownedServiceGalleryImage = this.digifranchiseGalleryImageRepository.create({
          imageUrl: image.imageUrl,
          digifranchiseServiceId: ownedService,
        });
        await this.digifranchiseGalleryImageRepository.save(ownedServiceGalleryImage);
      }
    }

    const createGeneralInfoInstance = this.digifranchiseGeneralInfoRepository.create({
      digifranchiseName: '',
      ownedDigifranchiseId: savedFranchiseOwner.id,
      facebookHandle: '',
      tiktokHandle: '',
      instagramHandle: '',
      xHandle: '',
      connectNumberWithOutCountryCode: '',
      connectNumber: '',
      address: '',
      otherMobileNumberWithOutCountryCode: '',
      otherMobileNumber: '',
      aboutCompany: '',
      location: ''
    });
    await this.digifranchiseGeneralInfoRepository.save(createGeneralInfoInstance);

    const createComplianceInfoInstance = this.digifranchiseComplianceInfoRepository.create({
      ownedDigifranchiseId: savedFranchiseOwner.id,
      companyRegisterationNumber: '',
      taxNumber: '',
      taxClearencePin: '',
      taxClearenceExpiration: '',
      coidaRegisteration: '',
      vatNumber: '',
      uifRegistration: '',
      workMansCompensation: '',
      sdlNumber: '',
      otherComplianceDocs: []
    });
    await this.digifranchiseComplianceInfoRepository.save(createComplianceInfoInstance);

    return savedFranchiseOwner;
  }

  async getDigifranchiseByDigifranchiseId(digifranchiseId: string): Promise<Digifranchise> {
    const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } });
    if (!digifranchise) {
      throw new NotFoundException('Digifranchise owner not found');
    }
    return digifranchise;
  }


  async findAllServiceOfferedByDigifranchiseId(digifranchiseId: string): Promise<DigifranchiseServiceOffered[]> {
    return await this.digifranchiseServiceOfferedRepository.find({
      where: {
        digifranchiseId: Equal(digifranchiseId),
        userId: IsNull(),
      },
      relations: ['digifranchiseId', 'serviceCategories', 'userId', 'serviceGalleryImages'],
    });
  }

  // async getServicesAndSubServicesByDigifranchiseId(digifranchiseId: string, userId: string): Promise<any> {
  //   const servicesOffered = await this.digifranchiseServiceOfferedRepository.find({
  //     where: {
  //       digifranchiseId: Equal(digifranchiseId),
  //       userId: IsNull(),
  //     },
  //     relations: ['digifranchiseId', 'serviceCategories', 'userId',
  //       'serviceGalleryImages',
  //       'selectedItem',
  //       'selectedItem.userId'
  //     ],

  //   });

  //   const servicesWithSubServices = await Promise.all(servicesOffered.map(async (service) => {
  //     const subServices = await this.digifranchiseSubServiceOfferedRepository.find({
  //       where: {
  //         digifranchiseServiceId: Equal(service.id),
  //       },
  //     });

  //     return {
  //       ...service,
  //       subServices,
  //     };
  //   }));

  //   return servicesWithSubServices;
  // }

  async getServicesAndSubServicesByDigifranchiseId(digifranchiseId: string, userId: string): Promise<any> {
    const servicesOffered = await this.digifranchiseServiceOfferedRepository.find({
       where: {
         digifranchiseId: Equal(digifranchiseId),
         userId: IsNull(),
       },
       relations: ['digifranchiseId', 'serviceCategories', 'userId',
         'serviceGalleryImages',
         'selectedItem',
         'selectedItem.userId'
       ],
    });
   
    const servicesWithSubServices = await Promise.all(servicesOffered.map(async (service) => {
       const filteredSelectedItems = service.selectedItem.filter(item => item.userId && item.userId.id === userId);
      //  if (filteredSelectedItems.length === 0) {
      //    return null;
      //  }
   
       const subServices = await this.digifranchiseSubServiceOfferedRepository.find({
         where: {
           digifranchiseServiceId: Equal(service.id),
         },
       });
   
       return {
         ...service,
         selectedItem: filteredSelectedItems, 
         subServices,
       };
    }));
   
    const filteredServicesWithSubServices = servicesWithSubServices.filter(service => service !== null);
   
    return filteredServicesWithSubServices;
   }

  async findAllOwnedDigifranchiseByUserId(userId: string): Promise<DigifranchiseOwner[]> {
    const ownershipRecords = await this.digifranchiseOwnershipRepository.find({
      where: { userId },
      relations: ['digifranchise', 'digifranchiseGeneralInfo', 'digifranchiseComplianceInfo'],
    });
    return ownershipRecords;
  }

  async findOneOwnedDigifranchiseByUserId(userId: string, digifranchiseId: string): Promise<DigifranchiseOwner | null> {
    const ownershipRecord = await this.digifranchiseOwnershipRepository.findOne({
      where: { userId, digifranchiseId },
      relations: ['digifranchise', 'digifranchiseGeneralInfo'],
    });
    return ownershipRecord || null;
  }
  async createSubDigifranchiseServiceOffered(
    createDigifranchiseSubServiceOfferedDto: CreateDigifranchiseSubServiceOfferedDto,
    userId: string,
    digifranchiseServiceId: string,
  ): Promise<DigifranchiseSubServices> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const Service = await this.digifranchiseServiceOfferedRepository.findOne({ where: { id: digifranchiseServiceId } });

    if (!Service) {
      throw new NotFoundException('Service not found');
    }

    const newDigifranchiseSubServiceOffered = this.digifranchiseSubServiceOfferedRepository.create({
      ...createDigifranchiseSubServiceOfferedDto,
      userId: user,
      digifranchiseServiceId: Service,
    });

    return this.digifranchiseSubServiceOfferedRepository.save(newDigifranchiseSubServiceOffered);
  }

  async getAllSubService(userId: string): Promise<DigifranchiseSubServices[]> {
    return await this.digifranchiseSubServiceOfferedRepository.find({ where: { userId: Equal(userId) } });
  }

  async getOneSubServiceById(userId: string, id: string): Promise<DigifranchiseSubServices> {
    const serviceOffered = await this.digifranchiseSubServiceOfferedRepository.findOne({ where: { id, userId: Equal(userId) } });
    if (!serviceOffered) {
      throw new NotFoundException('Sub service not found');
    }
    return serviceOffered;
  }
  async updateSubService(
    userId: string,
    id: string,
    updateDigifranchiseServiceDto: UpdateDigifranchiseSubServiceDto,
  ): Promise<DigifranchiseSubServices> {
    const serviceOffered = await this.digifranchiseSubServiceOfferedRepository.findOne({ where: { id, userId: Equal(userId) } });
    if (!serviceOffered) {
      throw new NotFoundException('Sub service not found');
    }

    Object.assign(serviceOffered, updateDigifranchiseServiceDto);

    try {
      return await this.digifranchiseSubServiceOfferedRepository.save(serviceOffered);
    } catch (error) {
      console.error('Error updating sub service:', error);
      throw error;
    }
  }

  async deleteSubService(userId: string, id: string): Promise<void> {
    const serviceOffered = await this.digifranchiseSubServiceOfferedRepository.findOne({ where: { id, userId: Equal(userId) } });
    if (!serviceOffered) {
      throw new NotFoundException('Digifranchise service offered not found');
    }

    await this.digifranchiseSubServiceOfferedRepository.remove(serviceOffered);
  }

  async getDigifranchiseByPhoneNumber(phoneNumber: string): Promise<any> {

    const getDigifranchiseGeneralInfoByPhone = await this.digifranchiseGeneralInfoRepository.findOne({
      where: [
        { connectNumberWithOutCountryCode: phoneNumber },
        { otherMobileNumberWithOutCountryCode: phoneNumber }
      ]
    })

    if (!getDigifranchiseGeneralInfoByPhone) {
      throw new NotFoundException('digifranchise not found')
    }

    if (!getDigifranchiseGeneralInfoByPhone.digifranchisePublished) {
      throw new NotFoundException('digifranchise not yet published')
    }

    const getDigifranchiseInformation = await this.digifranchiseOwnershipRepository.findOne({
      where: { id: getDigifranchiseGeneralInfoByPhone.ownedDigifranchiseId }
    })

    if (!getDigifranchiseInformation) {
      throw new NotFoundException('digifranchise not found')
    }

    const getComplianceInfo = await this.digifranchiseComplianceInfoRepository.findOne({
      where: { ownedDigifranchiseId: getDigifranchiseGeneralInfoByPhone.ownedDigifranchiseId }
    })

    const getProfessionalBodyMemberships = await this.digifranchiseProfessionalBodyMembershipRepository.find({
      where: { ownedDigifranchiseId: getDigifranchiseGeneralInfoByPhone.ownedDigifranchiseId }
    })

    const digifranchise = await this.digifranchiseRepository.findOne({
      where: { id: getDigifranchiseInformation.digifranchiseId }
    })

    const digifranchiseOwner = await this.userRepository.findOne({
      where: { id: getDigifranchiseInformation.userId }
    })

    const digifranchiseProducts = await this.productService.getProductsAndSubProductsById(getDigifranchiseInformation.digifranchiseId)
    const digifranchiseServices = await this.findAllServiceOfferedByDigifranchiseId(getDigifranchiseInformation.digifranchiseId)


    return {
      digifranchiseInfo: digifranchise,
      ownerInfo: digifranchiseOwner,
      generalInfo: getDigifranchiseGeneralInfoByPhone,
      complainceInfo: getComplianceInfo,
      professionalBodiesInfo: getProfessionalBodyMemberships,
      products: digifranchiseProducts,
      services: digifranchiseServices,

    }
  }

  async publishDigifranchiseWeb(digifranchiseId: string): Promise<any> {
    const digifranchiseGeneralInfo = await this.digifranchiseGeneralInfoRepository.findOne({
      where: { ownedDigifranchiseId: digifranchiseId }
    })

    if (!digifranchiseGeneralInfo) {
      throw new NotFoundException('digifranchise not found')
    }

    if (!digifranchiseGeneralInfo.connectNumber && !digifranchiseGeneralInfo.otherMobileNumber) {
      throw new NotFoundException('digifranchise is without phone number')
    }

    Object.assign(digifranchiseGeneralInfo, { digifranchisePublished: true })
    this.digifranchiseGeneralInfoRepository.save(digifranchiseGeneralInfo)

    return {
      message: 'your digifranchise has been published successfully'
    }
  }

  async unPublishDigifranchiseWeb(digifranchiseId: string): Promise<any> {
    const digifranchiseGeneralInfo = await this.digifranchiseGeneralInfoRepository.findOne({
      where: { ownedDigifranchiseId: digifranchiseId }
    })

    if (!digifranchiseGeneralInfo) {
      throw new NotFoundException('digifranchise not found')
    }

    if (!digifranchiseGeneralInfo.connectNumber && !digifranchiseGeneralInfo.otherMobileNumber) {
      throw new NotFoundException('digifranchise is without phone number')
    }

    Object.assign(digifranchiseGeneralInfo, { digifranchisePublished: false })
    this.digifranchiseGeneralInfoRepository.save(digifranchiseGeneralInfo)

    return {
      message: 'your digifranchise has been unpublished successfully'
    }
  }

  async getDigifranchiseServiceCategoryById(serviceCategoryById: string): Promise<DigifranchiseServiceCategory> {
    const category = await this.digifranchiseServiceCategoryRepository.findOne({
      where: { id: serviceCategoryById },
      relations: ['service', 'service.serviceGalleryImages'],
    });
    if (!category) {
      throw new NotFoundException(`DigifranchiseServiceCategory with ID ${serviceCategoryById} not found`);
    }
    return category;
  }

  async getDigifranchiseServiceOfferedById(serviceOfferedId: string): Promise<DigifranchiseServiceOffered> {
    const serviceOffered = await this.digifranchiseServiceOfferedRepository.findOne({
      where: { id: serviceOfferedId },
      relations: ['digifranchiseId', 'serviceCategories', 'serviceGalleryImages', 'userId'],

    });
    if (!serviceOffered) {
      throw new NotFoundException(`DigifranchiseServiceOffered with service Id ${serviceOfferedId} not found`);
    }
    return serviceOffered;
  }

  async getDigifranchiseProductById(productId: string): Promise<DigifranchiseProduct> {
    const product = await this.digifranchiseProductRepository.findOne({
      where: { id: productId },
      relations: ['digifranchiseId', 'productGalleryImages', 'userId'],

    });
    if (!product) {
      throw new NotFoundException(`DigifranchiseServiceOffered with service Id ${productId} not found`);
    }
    return product;
  }
}
