import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funding } from './entities/funding.entity';
import { CreateFundingDto } from './dto/Create-DTOs/create-funding.dto';
import { findFundingById } from 'src/helper/FindByFunctions';
import { User } from 'src/users/domain/user';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private readonly fundingRepository: Repository<Funding>,
    @InjectRepository(Digifranchise)
    private readonly DigifranchiseRepository: Repository<Digifranchise>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createFunding(
    createFundingDto: CreateFundingDto,
    userId: string,
  ): Promise<Funding> {
    const franchiseAccount = await this.DigifranchiseRepository.findOne({
      where: { userId: userId },
    });

    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    const newFunding = this.fundingRepository.create({
      ...createFundingDto,
      franchiseId: franchiseAccount,
    });

    const savedFunding = await this.fundingRepository.save(newFunding);

    return savedFunding;
  }

  async findAllFundings(
    startDate?: string,
    endDate?: string,
  ): Promise<{ fundings: Funding[]; count: number }> {
    const queryBuilder = this.fundingRepository.createQueryBuilder('funding');

    queryBuilder.leftJoinAndSelect('funding.franchiseId', 'franchise');

    if (startDate) {
      queryBuilder.andWhere('funding.fundedAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('funding.fundedAt <= :endDate', { endDate });
    }

    const fundings = await queryBuilder.getMany();
    const count = await queryBuilder.getCount();

    return { fundings, count };
  }

  async getFundingById(fundingId: string): Promise<Funding | null> {
    return findFundingById(this.fundingRepository, fundingId);
  }
}
