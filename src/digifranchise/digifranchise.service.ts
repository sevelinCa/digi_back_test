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
import { DigifranchiseOwnedProduct } from './entities/digifranchise-owned-product.entity';
import { DigifranchiseOwnedServiceOffered } from './entities/digifranchise-owned-service-offered.entity';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { DigifranchiseGalleryImage } from './entities/digifranchise-gallery-images.entity';
import { DigifranchiseServiceCategory } from './entities/digifranchise-service-category.entity';
import { DigifranchiseOwnedServiceCategory } from './entities/digifranchise-owned-service-category.entity';

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
 
    @InjectRepository(DigifranchiseOwnedServiceOffered)
    private digifranchiseOwnedServiceOfferedRepository: Repository<DigifranchiseOwnedServiceOffered>,
    @InjectRepository(DigifranchiseProduct)
    private digifranchiseProductRepository: Repository<DigifranchiseProduct>,

    // @InjectRepository(DigifranchiseOwnedServiceOffered)
    // private readonly digifranchiseOwnedServiceOffered: Repository<DigifranchiseOwnedServiceOffered>,
    @InjectRepository(DigifranchiseOwnedProduct)
    private digifranchiseOwnedProductRepository: Repository<DigifranchiseOwnedProduct>,

    @InjectRepository(DigifranchiseServiceCategory)
    private digifranchiseServiceCategoryRepository: Repository<DigifranchiseServiceCategory>,

    @InjectRepository(DigifranchiseGalleryImage)
    private digifranchiseGalleryImageRepository: Repository<DigifranchiseGalleryImage>,

    @InjectRepository(DigifranchiseOwnedServiceCategory)
    private digifranchiseOwnedServiceCategoryRepository: Repository<DigifranchiseOwnedServiceCategory>,
 
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
       const ownedProduct = this.digifranchiseOwnedProductRepository.create({
         productName: product.productName,
         description: product.description,
         unitPrice: product.unitPrice,
         ownedDigifranchiseId: savedFranchiseOwner,
       });
       await this.digifranchiseOwnedProductRepository.save(ownedProduct);
    }
   
    for (const service of services) {
      const ownedService = this.digifranchiseOwnedServiceOfferedRepository.create({
        serviceName: service.serviceName,
        description: service.description,
        unitPrice: service.unitPrice,
        ownedDigifranchiseId: savedFranchiseOwner,
      });
      await this.digifranchiseOwnedServiceOfferedRepository.save(ownedService);
  
      // Create owned service categories for each service
      const serviceCategories = await this.digifranchiseServiceCategoryRepository.find({
        where: { service: Equal(service.id) },
      });
      for (const category of serviceCategories) {
        const ownedServiceCategory = this.digifranchiseOwnedServiceCategoryRepository.create({
          serviceCategoryName: category.serviceCategoryName,
          unitPrice: category.unitPrice,
          description: category.description,
          ownedService: ownedService,
        });
        await this.digifranchiseOwnedServiceCategoryRepository.save(ownedServiceCategory);
      }
  
      const serviceGalleryImages = await this.digifranchiseGalleryImageRepository.find({
        where: { service: Equal(service.id) },
      });
      for (const image of serviceGalleryImages) {
        const ownedServiceGalleryImage = this.digifranchiseGalleryImageRepository.create({
          imageUrl: image.imageUrl,
          service: ownedService,
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
       connectNumber: '',
       address: '',
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
    return await this.digifranchiseServiceOfferedRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.serviceCategories', 'category', 'category.serviceId = service.id')
      .where('service.digifranchiseId = :digifranchiseId', { digifranchiseId })
      .andWhere('service.userId IS NULL')
      .getMany();
  }

  async getServicesAndSubServicesByDigifranchiseId(digifranchiseId: string): Promise<any> {
    const servicesOffered = await this.digifranchiseServiceOfferedRepository.find({
      where: {
        digifranchiseId: Equal(digifranchiseId),
        userId: IsNull(),
      },
    });

    const servicesWithSubServices = await Promise.all(servicesOffered.map(async (service) => {
      const subServices = await this.digifranchiseSubServiceOfferedRepository.find({
        where: {
          ownedServiceId: Equal(service.id),
        },
      });

      return {
        ...service,
        subServices,
      };
    }));

    return servicesWithSubServices;
  }

  async findAllOwnedDigifranchiseByUserId(userId: string): Promise<DigifranchiseOwner[]> {
    const ownershipRecords = await this.digifranchiseOwnershipRepository.find({
      where: { userId },
      relations: ['digifranchise', 'digifranchiseGeneralInfo'],
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
    serviceId: string,
  ): Promise<DigifranchiseSubServices> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const Service = await this.digifranchiseServiceOfferedRepository.findOne({ where: { id: serviceId } });

    if (!Service) {
      throw new NotFoundException('Service not found');
    }

    const newDigifranchiseSubServiceOffered = this.digifranchiseSubServiceOfferedRepository.create({
      ...createDigifranchiseSubServiceOfferedDto,
      userId: user,
      ownedServiceId: Service,
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
        { connectNumber: phoneNumber },
        { otherMobileNumber: phoneNumber }
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

    const ownedServices = await this.digifranchiseOwnedServiceOfferedRepository.find({
      where: { ownedDigifranchiseId: Equal(getDigifranchiseInformation.id) },
      relations: ['ownedServiceCategories', 'galleryImages', 'subServices'], 
     });
     
console.log('==== >OWned Service ====>', ownedServices)

     const ownedProducts = await this.digifranchiseOwnedProductRepository.find({
      where: { ownedDigifranchiseId: Equal(getDigifranchiseInformation.id) },
      relations: ['subProducts','galleryImages'], 
     });
    return {
      digifranchiseInfo: digifranchise,
      ownerInfo: digifranchiseOwner,
      generalInfo: getDigifranchiseGeneralInfoByPhone,
      complainceInfo: getComplianceInfo,
      professionalBodiesInfo: getProfessionalBodyMemberships,
      products: digifranchiseProducts,
      services: digifranchiseServices,
      ownedServices: ownedServices, 
      ownedProducts: ownedProducts, 
    
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
}
