import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/Create-DTOs/create-expense.dto';
import {
  findExpenseById,
  findFixedExpenseCategoryById,
  getDigifranchiseAccountByUserId,
} from 'src/helper/FindByFunctions';
import { FixedExpenseCategory } from './entities/fixedExpenseCategory.entity';
import { UpdateExpenseDto } from './dto/Update-DTOs/update-expense.dto';
import { User } from 'src/users/domain/user';
import { DigifranchiseAccount } from 'src/digifranchise/entities/digifranchise-account.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(DigifranchiseAccount)
    private readonly digifranchiseAccountRepository: Repository<DigifranchiseAccount>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FixedExpenseCategory)
    private readonly fixedExpenseCategoryRepository: Repository<FixedExpenseCategory>,
  ) {}

  async createExpense(
    createExpenseDto: CreateExpenseDto,
    userId: string,
    fixedExpenseId: string,
  ): Promise<Expense> {
    const expenseCategory = await findFixedExpenseCategoryById(
      this.fixedExpenseCategoryRepository,
      fixedExpenseId,
    );
    const franchiseAccount = await getDigifranchiseAccountByUserId(
      this.digifranchiseAccountRepository,
      userId,
    );

    if (!expenseCategory) {
      throw new NotFoundException(
        `Fixed expense category not found for ID ${fixedExpenseId}`,
      );
    }

    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    const newExpense = this.expenseRepository.create({
      ...createExpenseDto,
      fixedExpenseCategoryId: expenseCategory,
      franchiseId: franchiseAccount,
    });

    const savedExpense = await this.expenseRepository.save(newExpense);

    return savedExpense;
  }

  async findAllExpenses(
    startDate?: string,
    endDate?: string,
  ): Promise<{ expenses: Expense[]; count: number }> {
    const queryBuilder = this.expenseRepository.createQueryBuilder('expense');

    queryBuilder
      .leftJoinAndSelect('expense.franchiseId', 'franchise')
      .leftJoinAndSelect(
        'expense.fixedExpenseCategoryId',
        'fixedExpenseCategory',
      );

    if (startDate) {
      queryBuilder.andWhere('expense.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('expense.date <= :endDate', { endDate });
    }

    const expenses = await queryBuilder.getMany();
    const count = await queryBuilder.getCount();

    return { expenses, count };
  }

  async getExpenseById(expenseId: string): Promise<Expense | null> {
    return findExpenseById(this.expenseRepository, expenseId);
  }

  async updateExpense(
    expenseId: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await findExpenseById(this.expenseRepository, expenseId);
    if (!expense) {
      throw new NotFoundException(`Expense not found with ID ${expenseId}`);
    }

    const updatedExpense = this.expenseRepository.merge(
      expense,
      updateExpenseDto,
    );
    return this.expenseRepository.save(updatedExpense);
  }

  async deleteExpense(expenseId: string): Promise<void> {
    const expense = await findExpenseById(this.expenseRepository, expenseId);
    if (!expense) {
      throw new NotFoundException(`Expense not found with ID ${expenseId}`);
    }

    await this.expenseRepository.remove(expense);
  }
}
