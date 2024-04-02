import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DigifranchiseExpenseService } from './digifranchise-expense.service';
import { CreateDigifranchiseExpenseDto, UpdateDigifranchiseExpenseDto } from './dto/create-digifranchise-expense.dto';
import { DigifranchiseExpense } from './entities/digifranchise-expense.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Digifranchise - Expense')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise-expense', version: '1' })

export class DigifranchiseExpenseController {
    constructor(private readonly digifranchiseExpenseService: DigifranchiseExpenseService) { }


    @ApiOperation({ summary: 'CREATE - Create a new digifrachise expense' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'A new expense has been successfully created.' })
    @ApiBody({ type: CreateDigifranchiseExpenseDto })
    @Post('create-new-expense/:ownedDigifranchiseId/:fixedExpenseCategoryId')
    async createDigifranchiseExpense(
        @Param('ownedDigifranchiseId') ownedDigifranchiseId: string,
        @Param('fixedExpenseCategoryId') fixedExpenseCategoryId: string,
        @Body() createDigifranchiseExpenseDto: CreateDigifranchiseExpenseDto,
    ): Promise<DigifranchiseExpense> {
        return this.digifranchiseExpenseService.createDigifranchiseExpense(createDigifranchiseExpenseDto, ownedDigifranchiseId, fixedExpenseCategoryId);
    }

    @ApiOperation({ summary: 'GET - Fetch all digifranchise expenses' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All expenses have been successfully retrieved.' })
    @Get()
    async getAllDigifranchiseExpenses(): Promise<DigifranchiseExpense[]> {
        return this.digifranchiseExpenseService.getAllDigifranchiseExpenses();
    }

    @ApiOperation({ summary: 'UPDATE - Update a digifranchise expense' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The expense has been successfully updated.' })
    @ApiBody({ type: UpdateDigifranchiseExpenseDto })
    @Put('update-expense/:expenseId')
    async updateDigifranchiseExpense(
        @Param('expenseId') expenseId: string,
        @Body() updateDigifranchiseExpenseDto: UpdateDigifranchiseExpenseDto,
    ): Promise<DigifranchiseExpense> {
        return this.digifranchiseExpenseService.updateDigifranchiseExpense( expenseId,updateDigifranchiseExpenseDto );
    }
}
