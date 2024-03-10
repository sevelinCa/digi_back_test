import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service.entity';
import { checkIfDigifranchiseExists } from 'src/helper/FindByFunctions';
import type { CreateDigifranchiseServiceOfferedDto, UpdateDigifranchiseServiceOfferedDto } from './dto/create-digifranchiseServiceOffered.dto';
import type { CreateDigifranchiseSubServiceOfferedDto, UpdateDigifranchiseSubServiceDto } from './dto/create-digifranchise-SubServiceOffered.dto';
import { DigifranchiseSubServices } from './entities/digifranchise-sub-service.entity';
import type { CreateDigifranchiseDto } from './dto/create-digifranchise.dto';
import { DigifranchiseGeneralInfo } from './entities/digifranchise-general-information.entity';
import { DigifranchiseComplianceInfo } from './entities/digifranchise-compliance-information.entity';
import { DigifranchiseProfessionalBodyMembership } from './entities/digifranchise-professional-body-membership.entity';

@Injectable()
export class DigifranchiseService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DigifranchiseOwner)
    private franchiseOwnershipRepository: Repository<DigifranchiseOwner>,
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
    private readonly digifranchiseProfessionalBodyMembershipRepository: Repository<DigifranchiseProfessionalBodyMembership>
  ) { }

  async createDigifranchise(createDigifranchiseDto: CreateDigifranchiseDto): Promise<Digifranchise> {
    const newDigifranchise = this.digifranchiseRepository.create(createDigifranchiseDto);
    return this.digifranchiseRepository.save(newDigifranchise);
  }

  async findAllDigifranchise(): Promise<Digifranchise[]> {
    return await this.digifranchiseRepository.find();
  }

  async ownDigifranchise(userId: string, digifranchiseId: string): Promise<DigifranchiseOwner> {
    const existingOwnership = await this.franchiseOwnershipRepository.findOne({ where: { userId, digifranchiseId: Equal(digifranchiseId) } });
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
    const newFranchiseOwner = this.franchiseOwnershipRepository.create({
      userId,
      digifranchiseId: digifranchiseId,
      digifranchise: digifranchise,
    });

    const savedFranchiseOwner = await this.franchiseOwnershipRepository.save(newFranchiseOwner)


    // create general information instance
    const createGeneralInfoInstance = this.digifranchiseGeneralInfoRepository.create({
      digifranchiseName: '',
      ownedDigifranchiseId: savedFranchiseOwner.digifranchiseId,
      facebookHandle: '',
      tiktokHandle: '',
      instagramHandle: '',
      xHandle: '',
      connectNumber: '',
      address: '',
      otherMobileNumber: '',
      aboutCompany: '',
      location: ''
    })
    await this.digifranchiseGeneralInfoRepository.save(createGeneralInfoInstance)

    // create compliance Information
    const createComplianceInfoInstance = this.digifranchiseComplianceInfoRepository.create({
      ownedDigifranchiseId: savedFranchiseOwner.digifranchiseId,
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
    })
    await this.digifranchiseComplianceInfoRepository.save(createComplianceInfoInstance)

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
    });
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
           serviceId: Equal(service.id),
         },
       });
   
       return {
         ...service,
         subServices,
       };
    }));
   
    return servicesWithSubServices;
   }

  async findAllOwnedDigifranchiseByUserId(userId: string): Promise<Digifranchise[]> {
    const ownershipRecords = await this.franchiseOwnershipRepository.find({
      where: { userId },
      relations: ['digifranchise'],
    });

    const digifranchiseIds = ownershipRecords
      .filter(record => record.digifranchise)
      .map(record => record.digifranchise.id);

    return this.digifranchiseRepository.findByIds(digifranchiseIds);
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
      serviceId: Service,
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
}
