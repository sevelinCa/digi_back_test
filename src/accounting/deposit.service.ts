import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deposit } from './entities/deposit.entity';
import { CreateDepositDto } from './dto/Create-DTOs/create-deposit.dto';
import { findDepositById } from 'src/helper/FindByFunctions';
import { DigifranchiseAccount } from 'src/digifranchise/entities/digifranchise-account.entity';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    @InjectRepository(DigifranchiseAccount)
    private readonly digifranchiseAccountRepository: Repository<DigifranchiseAccount>,
  ) {}

  async createDeposit(
    createDepositDto: CreateDepositDto,
    userId: string,
  ): Promise<Deposit> {
    const franchiseAccount = await this.digifranchiseAccountRepository.findOne({
      where: { userId: userId },
    });

    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    const newDeposit = this.depositRepository.create({
      ...createDepositDto,
      franchiseId: franchiseAccount,
    });

    const savedDeposit = await this.depositRepository.save(newDeposit);

    return savedDeposit;
  }

  async findAllDeposits(
    startDate?: string,
    endDate?: string,
  ): Promise<{ deposits: Deposit[]; count: number }> {
    const queryBuilder = this.depositRepository.createQueryBuilder('deposit');

    queryBuilder.leftJoinAndSelect('deposit.franchiseId', 'franchise');

    if (startDate) {
      queryBuilder.andWhere('deposit.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('deposit.createdAt <= :endDate', { endDate });
    }

    const deposits = await queryBuilder.getMany();
    const count = await queryBuilder.getCount();

    return { deposits, count };
  }

  async getDepositById(depositId: string): Promise<Deposit | null> {
    return findDepositById(this.depositRepository, depositId);
  }
}
