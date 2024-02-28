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

    @InjectRepository(DigifranchiseSubServices)
    private readonly digifranchiseSubServiceOfferedRepository:Repository<DigifranchiseSubServices>

  ) { }


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

    return this.franchiseOwnershipRepository.save(newFranchiseOwner);
  }

  async findAllByDigifranchiseId(digifranchiseId: string): Promise<DigifranchiseServiceOffered[]> {
    return await this.digifranchiseServiceOfferedRepository.find({
      where: {
        digifranchiseId: Equal(digifranchiseId),
        userId: IsNull(),
      },
    });
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
      serviceId : Service,  
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
