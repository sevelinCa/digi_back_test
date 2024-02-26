import { Injectable,  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Equal, Repository } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { FranchiseOwner } from './entities/franchise-ownership.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service.entity';
import { checkIfDigifranchiseExists } from 'src/helper/FindByFunctions';

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

  async ownDigifranchise(userId: string, userFullNames: string, role: string, digifranchiseId: string): Promise<FranchiseOwner> {
    const digifranchiseExists = await checkIfDigifranchiseExists(this.digifranchiseRepository, digifranchiseId);
    if (!digifranchiseExists) {
      throw new Error('Digifranchise not found');
    }
  
    const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } });    if (!digifranchise) {
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

  async findAllDigifranchise(): Promise<Digifranchise[]> {
    return await this.digifranchiseRepository.find();
  }

  async findAllByDigifranchiseId(digifranchiseId: string): Promise<DigifranchiseServiceOffered[]> {
    return await this.digifranchiseServiceOfferedRepository.find({ where: { digifranchiseId: Equal(digifranchiseId) } });
  }

}
