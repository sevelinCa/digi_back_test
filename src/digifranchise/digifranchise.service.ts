import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { FranchiseOwnership } from './entities/franchise-ownership.entity';
import { checkIfUserExists, getDigifranchiseAccountByUserId, getDigifranchiseById } from 'src/helper/FindByFunctions';
import { Digifranchise } from './entities/digifranchise.entity';

@Injectable()
export class DigifranchiseService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(FranchiseOwnership)
    private franchiseOwnershipRepository: Repository<FranchiseOwnership>,
    @InjectRepository(Digifranchise)
    private digifranchiseRepository: Repository<Digifranchise>,
  ) {}


  async createDigifranchiseAccount(userId: string, userFullNames: string, digifranchiseId: string): Promise<FranchiseOwnership> {
    const existingFranchiseOwnership = await getDigifranchiseAccountByUserId(this.franchiseOwnershipRepository, userId);
    if (existingFranchiseOwnership) {
      throw new NotFoundException(`Franchise account already exists for user with ID ${userId}`);
    }
    const user = await checkIfUserExists(this.userRepository, userId);
    if (!user) {
      throw new NotFoundException(`User not found with ID ${userId}`);
    }
    const digifranchise = await getDigifranchiseById(this.digifranchiseRepository, digifranchiseId);
    if (!digifranchise) {
      throw new NotFoundException(`Digifranchise not found with ID ${digifranchiseId}`);
    }
    const newFranchiseOwnership = this.franchiseOwnershipRepository.create({
      userId: user.id,
      userFullNames: userFullNames,
      digifranchise: digifranchise,
    });

    const savedFranchiseOwnership = await this.franchiseOwnershipRepository.save(newFranchiseOwnership);


    return savedFranchiseOwnership;
  }


  async findAllActiveDigifranchises(): Promise<{ digifranchises: Digifranchise[]; count: number }> {
    const queryBuilder = this.digifranchiseRepository.createQueryBuilder('digifranchise');

    queryBuilder.where('digifranchise.deleteAt IS NULL');

    const digifranchises = await queryBuilder.getMany();
    const count = await queryBuilder.getCount();

    return { digifranchises, count };
  }
}
