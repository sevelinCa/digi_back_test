import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigifranchiseExpense } from './entities/digifranchise-expense.entity';
import { CreateDigifranchiseExpenseDto, type UpdateDigifranchiseExpenseDto } from './dto/create-digifranchise-expense.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { FixedExpenseCategory } from 'src/accounting/entities/fixedExpenseCategory.entity';

@Injectable()
export class DigifranchiseExpenseService {
    constructor(
        @InjectRepository(DigifranchiseExpense)
        private readonly digifranchiseExpenseRepository: Repository<DigifranchiseExpense>,
        @InjectRepository(DigifranchiseOwner)
        private readonly DigifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
        @InjectRepository(FixedExpenseCategory)
        private readonly fixedExpenseCategoryRepository: Repository<FixedExpenseCategory>,
    ) { }

    async createDigifranchiseExpense(
        createDigifranchiseExpenseDto: CreateDigifranchiseExpenseDto,
        ownedDigifranchiseId: string,
        fixedExpenseCategoryId: string,
        
    ): Promise<DigifranchiseExpense> {
        const franchise = await this.DigifranchiseOwnerRepository.findOne({
            where: { id: ownedDigifranchiseId }
        });
        if (!franchise) {
            throw new NotFoundException('Franchise not found');
        }

        const fixedExpenseCategory = await this.fixedExpenseCategoryRepository.findOne({
            where: { id: fixedExpenseCategoryId }
        });
        if (!fixedExpenseCategory) {
            throw new NotFoundException('Fixed expense category not found');
        }

        const newDigifranchiseExpense = this.digifranchiseExpenseRepository.create({
            ...createDigifranchiseExpenseDto,
            ownedDigifranchiseId: franchise,
            fixedExpenseCategoryId: fixedExpenseCategory,
        });

        return this.digifranchiseExpenseRepository.save(newDigifranchiseExpense);
    }


    async getAllDigifranchiseExpenses(): Promise<DigifranchiseExpense[]> {
        return this.digifranchiseExpenseRepository.find();
    }


    async updateDigifranchiseExpense(expnseId: string, updateDigifranchiseExpenseDto: UpdateDigifranchiseExpenseDto): Promise<DigifranchiseExpense> {
        const expense = await this.digifranchiseExpenseRepository.findOne({where:{id:expnseId}});
        if (!expense) {
            throw new NotFoundException(`Expense with expnseId ${expnseId} not found`);
        }

        Object.assign(expense, updateDigifranchiseExpenseDto);

        return this.digifranchiseExpenseRepository.save(expense);
    }
}