import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { FixedExpenseCategory } from './entities/fixedExpenseCategory.entity';
import { CreateFixedExpenseDto } from './dto/Create-DTOs/create-fixed-expense.dto';
import { IsNull } from 'typeorm';
import { checkIfUserExists, findUserById } from 'src/helper/FindByFunctions';
import { DigifranchiseAccount } from 'src/digifranchise/entities/digifranchise-account.entity';
import { User } from 'src/users/domain/user';

@Injectable()
export class ManagerFixedExpensesService {
  constructor(
    @InjectRepository(FixedExpenseCategory)
    private fixedExpenseRepository: Repository<FixedExpenseCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createFixedExpenses(
    createFixedExpenseDto: CreateFixedExpenseDto,
  ): Promise<FixedExpenseCategory> {
    const fixedExpense = this.fixedExpenseRepository.create({
      ...createFixedExpenseDto,
      userId: null,
    });

    return this.fixedExpenseRepository.save(fixedExpense);
  }

  async getAllFixedExpensesCategories(): Promise<FixedExpenseCategory[]> {
    return this.fixedExpenseRepository.find({
      where: { userId: IsNull() },
    });
  }

  async getFixedExpenses(
    fixedExpenseId: string,
  ): Promise<FixedExpenseCategory> {
    const fixedExpense = await this.fixedExpenseRepository.findOne({
      where: { id: fixedExpenseId },
    });
    if (!fixedExpense) {
      throw new NotFoundException(
        `Fixed Expense with ID ${fixedExpenseId} not found`,
      );
    }
    return fixedExpense;
  }

  async updateFixedExpenses(
    fixedExpenseId: string,
    updateData: CreateFixedExpenseDto,
  ): Promise<FixedExpenseCategory> {
    const fixedExpense = await this.getFixedExpenses(fixedExpenseId);
    this.fixedExpenseRepository.merge(fixedExpense, updateData);
    return this.fixedExpenseRepository.save(fixedExpense);
  }

  async deleteFixedExpenses(fixedExpenseId: string): Promise<void> {
    const fixedExpense = await this.getFixedExpenses(fixedExpenseId);
    await this.fixedExpenseRepository.remove(fixedExpense);
  }
}

@Injectable()
export class ClientFixedExpensesService {
  constructor(
    @InjectRepository(FixedExpenseCategory)
    private fixedExpenseRepository: Repository<FixedExpenseCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DigifranchiseAccount)
    private readonly digifranchiseAccountRepository: Repository<DigifranchiseAccount>,
  ) {}

  async createFixedExpenses(
    createFixedExpenseDto: CreateFixedExpenseDto,
    userId: string,
  ): Promise<FixedExpenseCategory> {
    await checkIfUserExists(this.digifranchiseAccountRepository, userId);

    const user = await findUserById(this.userRepository, userId);

    const fixedExpense = this.fixedExpenseRepository.create({
      ...createFixedExpenseDto,
      userId: user,
    });

    return this.fixedExpenseRepository.save(fixedExpense);
  }

  async getAllFixedExpensesCategories(userId: string): Promise<{
    userSpecific: FixedExpenseCategory[];
    predefined: FixedExpenseCategory[];
  }> {
    await checkIfUserExists(this.digifranchiseAccountRepository, userId);

    const userSpecific = await this.fixedExpenseRepository
      .createQueryBuilder('fixedExpense')
      .leftJoin('fixedExpense.userId', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    const predefined = await this.fixedExpenseRepository
      .createQueryBuilder('fixedExpense')
      .where('fixedExpense.userId IS NULL')
      .getMany();

    return {
      userSpecific,
      predefined,
    };
  }

  async getFixedExpenses(
    userId: string,
    fixedExpenseId: string,
  ): Promise<FixedExpenseCategory> {
    await checkIfUserExists(this.digifranchiseAccountRepository, userId);

    const fixedExpense = await this.fixedExpenseRepository
      .createQueryBuilder('fixedExpense')
      .leftJoinAndSelect('fixedExpense.userId', 'user')
      .where('fixedExpense.id = :fixedExpenseId', { fixedExpenseId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.id = :userId').orWhere('user.id IS NULL');
        }),
        { userId },
      )
      .getOne();

    if (!fixedExpense) {
      throw new NotFoundException(
        `Fixed Expense with ID ${fixedExpenseId} not found for user with ID ${userId}`,
      );
    }
    return fixedExpense;
  }

  async updateFixedExpenses(
    userId: string,
    fixedExpenseId: string,
    updateData: CreateFixedExpenseDto,
  ): Promise<FixedExpenseCategory> {
    await checkIfUserExists(this.digifranchiseAccountRepository, userId);

    const fixedExpense = await this.getFixedExpenses(userId, fixedExpenseId);

    this.fixedExpenseRepository.merge(fixedExpense, updateData);

    return this.fixedExpenseRepository.save(fixedExpense);
  }

  async deleteFixedExpenses(
    userId: string,
    fixedExpenseId: string,
  ): Promise<void> {
    const fixedExpense = await this.getFixedExpenses(userId, fixedExpenseId);

    if (fixedExpense.userId?.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this expense.',
      );
    }
    await this.fixedExpenseRepository.remove(fixedExpense);
  }
}
