import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './entities/income.entity';
import { CreateIncomeDto } from './dto/Create-DTOs/create-income.dto';
import {
  findIncomeById, getDigifranchiseAccountByUserId,
} from 'src/helper/FindByFunctions';
import { UpdateIncomeDto } from './dto/Update-DTOs/update-income.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(DigifranchiseOwner)
    private readonly DigifranchiseRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createIncome(
    createIncomeDto: CreateIncomeDto,
    userId: string,
  ): Promise<Income> {
    const franchiseAccount = await getDigifranchiseAccountByUserId(
      this.DigifranchiseRepository,
      userId,
    );

    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    const totalAmount = createIncomeDto.quantity * createIncomeDto.unityCost;

    const newIncome = this.incomeRepository.create({
      ...createIncomeDto,
      franchiseId: franchiseAccount,
      totalAmount,
    });

    const savedIncome = await this.incomeRepository.save(newIncome);

    return savedIncome;
  }

  async findAllIncomes(
    startDate?: string,
    endDate?: string,
  ): Promise<{ incomes: Income[]; count: number }> {
    const queryBuilder = this.incomeRepository.createQueryBuilder('income');
  
    queryBuilder.leftJoinAndSelect('income.franchiseId', 'franchise');
  
    queryBuilder.where('income.deleteAt IS NULL');
  
    if (startDate) {
      queryBuilder.andWhere('income.createdAt >= :startDate', { startDate });
    }
  
    if (endDate) {
      queryBuilder.andWhere('income.createdAt <= :endDate', { endDate });
    }
  
    const incomes = await queryBuilder.getMany();
    const count = await queryBuilder.getCount();
  
    return { incomes, count };
  }

  async getIncomeById(incomeId: string): Promise<Income | null> {
    return findIncomeById(this.incomeRepository, incomeId);
  }

  async updateIncome(
    incomeId: string,
    updateIncomeDto: UpdateIncomeDto,
  ): Promise<Income> {
    const income = await findIncomeById(this.incomeRepository, incomeId);
    if (!income) {
      throw new NotFoundException(`Income not found with ID ${incomeId}`);
    }
    Object.keys(updateIncomeDto).forEach((key) => {
      income[key] = updateIncomeDto[key];
    });

    if (
      updateIncomeDto.quantity !== undefined ||
      updateIncomeDto.unityCost !== undefined
    ) {
      income.totalAmount = (income.quantity ?? 0) * (income.unityCost ?? 0);
    }

    return this.incomeRepository.save(income);
  }

  async deleteIncome(incomeId: string): Promise<void> {
    const income = await findIncomeById(this.incomeRepository, incomeId);
    if (!income) {
      throw new NotFoundException(`Income not found with ID ${incomeId}`);
    }

    income.deleteAt = new Date(); 

    await this.incomeRepository.save(income); 
  }
}
