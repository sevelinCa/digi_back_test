import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { FranchiseOwner } from './entities/franchise-ownership.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service.entity';
import { checkIfDigifranchiseExists } from 'src/helper/FindByFunctions';
import type { CreateDigifranchiseServiceOfferedDto, UpdateDigifranchiseServiceOfferedDto } from './dto/create-digifranchiseServiceOffered.dto';

@Injectable()
export class DigifranchiseService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(FranchiseOwner)
    private franchiseOwnershipRepository: Repository<FranchiseOwner>,
    @InjectRepository(Digifranchise)
    private digifranchiseRepository: Repository<Digifranchise>,
    @InjectRepository(DigifranchiseServiceOffered)
    private readonly digifranchiseServiceOfferedRepository: Repository<DigifranchiseServiceOffered>,
    @InjectRepository(FranchiseOwner)
    private readonly franchiseOwnerRepository: Repository<FranchiseOwner>,

  ) { }

  // async createMainDigifranchiseService(
  //   createDigifranchiseDto: CreateDigifranchiseDto
  // ): Promise<Digifranchise> {
  //   console.log('createDigifranchiseDto:', createDigifranchiseDto);

  //   const newDigifranchise = this.digifranchiseRepository.create({
  //     ...createDigifranchiseDto,
  //   });

  //   const savedDigifranchise = await this.digifranchiseRepository.save(newDigifranchise);

  //   return savedDigifranchise;
  // }

  async findAllDigifranchise(): Promise<Digifranchise[]> {
    return await this.digifranchiseRepository.find();
  }

  async findAllByDigifranchiseId(digifranchiseId: string): Promise<DigifranchiseServiceOffered[]> {
    return await this.digifranchiseServiceOfferedRepository.find({ where: { digifranchiseId: Equal(digifranchiseId) } });
  }


  async ownDigifranchise(userId: string, userFullNames: string, role: string, digifranchiseId: string): Promise<FranchiseOwner> {
    const existingOwnership = await this.franchiseOwnerRepository.findOne({ where: { userId, digifranchiseId: Equal(digifranchiseId) } });
    if (existingOwnership) {
      throw new Error('User already owns this digifranchise');
    }

    const digifranchiseExists = await checkIfDigifranchiseExists(this.digifranchiseRepository, digifranchiseId);
    if (!digifranchiseExists) {
      throw new Error('Digifranchise not found');
    }

    const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } });
    if (!digifranchise) {
      throw new Error('Digifranchise not found');
    }
    const newFranchiseOwner = this.franchiseOwnerRepository.create({
      userId,
      userFullNames,
      role,
      digifranchiseId: digifranchise,
    });

    return this.franchiseOwnerRepository.save(newFranchiseOwner);
  }


  async findAllOwnedDigifranchiseByUserId(userId: string): Promise<Digifranchise[]> {
    const ownershipRecords = await this.franchiseOwnerRepository.find({
      where: { userId },
      relations: ['digifranchiseId'],
    });

    const digifranchiseIds = ownershipRecords
      .filter(record => record.digifranchiseId)
      .map(record => record.digifranchiseId.id);

    return this.digifranchiseRepository.findByIds(digifranchiseIds);
  }

  async createSubDigifranchiseServiceOffered(
    createDigifranchiseServiceOfferedDto: CreateDigifranchiseServiceOfferedDto,
    userId: string,
    digifranchiseId: string,
  ): Promise<DigifranchiseServiceOffered> {
    const digifranchiseExists = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } });
    if (!digifranchiseExists) {
      throw new NotFoundException('Digifranchise not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newDigifranchiseServiceOffered = this.digifranchiseServiceOfferedRepository.create({
      ...createDigifranchiseServiceOfferedDto,
      userId: user,
      digifranchiseId: digifranchiseExists,
    });

    return this.digifranchiseServiceOfferedRepository.save(newDigifranchiseServiceOffered);
  }

  async getAllDigifranchiseServiceOffered(userId: string): Promise<DigifranchiseServiceOffered[]> {
    return await this.digifranchiseServiceOfferedRepository.find({ where: { userId: Equal(userId) } });
  }

  async getOneDigifranchiseServiceOffered(userId: string, id: string): Promise<DigifranchiseServiceOffered> {
    const serviceOffered = await this.digifranchiseServiceOfferedRepository.findOne({ where: { id, userId: Equal(userId) } });
    if (!serviceOffered) {
      throw new NotFoundException('Digifranchise service offered not found');
    }
    return serviceOffered;
  }
}
