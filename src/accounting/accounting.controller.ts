import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  ValidationPipe,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
  Query,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { User } from '../users/domain/user';
import { Request } from 'express';
import { CreateFixedExpenseDto } from './dto/Create-DTOs/create-fixed-expense.dto';
import { FixedExpenseCategory } from './entities/fixedExpenseCategory.entity';
import {
  ClientFixedExpensesService,
  ManagerFixedExpensesService,
} from './fixed-expenses.service';
import { CreateExpenseDto } from './dto/Create-DTOs/create-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseService } from './expenses.service';
import { getDigifranchiseAccountByUserId } from 'src/helper/FindByFunctions';
import { Expense } from './entities/expense.entity';
import { CreateIncomeDto } from './dto/Create-DTOs/create-income.dto';
import { IncomeService } from './income.service';
import { Income } from './entities/income.entity';
import { FundingService } from './funding.service';
import { CreateFundingDto } from './dto/Create-DTOs/create-funding.dto';
import { Funding } from './entities/funding.entity';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/Create-DTOs/create-deposit.dto';
import { Deposit } from './entities/deposit.entity';
import { CreateOperatingParametersDto } from './dto/Create-DTOs/create-operating-parameters.dto';
import { OperatingParameters } from './entities/operationParamenters.entity';
import { OperatingParametersService } from './operating-parameters.service';
import { UpdateExpenseDto } from './dto/Update-DTOs/update-expense.dto';
import { UpdateIncomeDto } from './dto/Update-DTOs/update-income.dto';
import type { UpdateFundingDto } from './dto/Update-DTOs/update-funding.dto';
import type { UpdateDepositDto } from './dto/Update-DTOs/update-deposity.dto';
import type { UpdateOperatingParametersDto } from './dto/Update-DTOs/update-operating-parameters.dto';
import { FranchiseOwnership } from 'src/digifranchise/entities/franchise-ownership.entity';


@ApiTags('Admin - Fixed Expenses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'fixed-expenses', version: '1' })
export class ManagerFixedExpensesController {
  constructor(
    private readonly managerFixedExpensesService: ManagerFixedExpensesService,
  ) {}

  @Roles(RoleEnum.admin)
  @ApiOperation({
    summary: 'CREATE - Create Fixed Expense for MANAGER',
  })
  @Post('create')
  async createFixedExpenses(
    @Req() req: Request,
    @Body(new ValidationPipe())
    createFixedExpenseDto: CreateFixedExpenseDto,
  ): Promise<FixedExpenseCategory> {
    return this.managerFixedExpensesService.createFixedExpenses(
      createFixedExpenseDto,
    );
  }

  @Roles()
  @ApiOperation({
    summary: 'GET ALL - Retreive All Fixed Expenses for ALL USERS ',
  })
  @Get()
  async getAllFixedExpensesCategories(): Promise<FixedExpenseCategory[]> {
    return this.managerFixedExpensesService.getAllFixedExpensesCategories();
  }

  @Roles()
  @ApiOperation({
    summary: 'GET ONE - Retreive Fixed Expenses for ALL USERS',
  })
  @Get(':id')
  async getFixedExpenses(
    @Param('id') id: string,
  ): Promise<FixedExpenseCategory> {
    return this.managerFixedExpensesService.getFixedExpenses(id);
  }

  @Roles()
  @ApiOperation({
    summary: 'UPDATE ONE - UPDATE Fixed Expenses based Id for MANAGER',
  })
  @Put(':id')
  async updateFixedExpenses(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateData: CreateFixedExpenseDto,
  ): Promise<FixedExpenseCategory> {
    return this.managerFixedExpensesService.updateFixedExpenses(id, updateData);
  }

  @Roles()
  @ApiOperation({
    summary: 'DELETE ONE - DELETE Fixed Expenses  based on Id for MANAGER',
  })
  @Delete(':id')
  async deleteFixedExpenses(@Param('id') id: string): Promise<void> {
    return this.managerFixedExpensesService.deleteFixedExpenses(id);
  }
}

@ApiTags('Client - Fixed Expenses')
@ApiBearerAuth()
@Roles()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'fixed-expense', version: '1' })
export class ClientFixedExpensesController {
  constructor(
    private readonly clientFixedExpensesService: ClientFixedExpensesService,
  ) {}

  @ApiOperation({
    summary: 'CREATE - Create Fixed Expense for User',
  })
  @Post('create')
  async createFixedExpenses(
    @Req() req: Request,
    @Body(new ValidationPipe())
    createFixedExpenseDto: CreateFixedExpenseDto,
  ): Promise<FixedExpenseCategory> {
    const userId = (req.user as User).id;
    return this.clientFixedExpensesService.createFixedExpenses(
      createFixedExpenseDto,
      userId,
    );
  }

  @ApiOperation({
    summary:
      'GET ALL - Retrieve both user-specific and predefined Fixed Expenses Categories',
  })
  @Get()
  async getAllFixedExpensesCategories(@Req() req: Request): Promise<{
    userSpecific: FixedExpenseCategory[];
    predefined: FixedExpenseCategory[];
  }> {
    const userId = (req.user as User).id;
    return this.clientFixedExpensesService.getAllFixedExpensesCategories(
      userId,
    );
  }

  @ApiOperation({
    summary: 'GET ONE - Retrieve Fixed Expenses based on User and Id',
  })
  @Get(':id')
  async getFixedExpenses(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<FixedExpenseCategory> {
    const userId = (req.user as User).id;
    return this.clientFixedExpensesService.getFixedExpenses(userId, id);
  }

  @ApiOperation({
    summary: 'UPDATE ONE - UPDATE Fixed Expenses based on User and Id',
  })
  @Put(':id')
  async updateFixedExpenses(
    @Req() req: Request,
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateData: CreateFixedExpenseDto,
  ): Promise<FixedExpenseCategory> {
    const userId = (req.user as User).id;
    return this.clientFixedExpensesService.updateFixedExpenses(
      userId,
      id,
      updateData,
    );
  }

  @ApiOperation({
    summary: 'DELETE ONE - DELETE Fixed Expenses based on User and Id',
  })
  @Delete(':id')
  async deleteFixedExpenses(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const userId = (req.user as User).id;
    return this.clientFixedExpensesService.deleteFixedExpenses(userId, id);
  }
}

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'expense', version: '1' })
export class ExpensesController {
  constructor(
    private readonly expenseService: ExpenseService,
    @InjectRepository(FranchiseOwnership)
    private readonly DigifranchiseRepository: Repository<FranchiseOwnership>,
  ) {}
  @ApiOperation({
    summary: 'CREATE - Record Fixed Expense for User',
  })
  @Post(':fixedExpenseId')
  async create(
    @Req() req: Request,
    @Param('fixedExpenseId') fixedExpenseId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    const userId = (req.user as User).id;
    const franchiseAccount = await getDigifranchiseAccountByUserId(
      this.DigifranchiseRepository,
      userId,
    );

    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    return this.expenseService.createExpense(
      createExpenseDto,
      userId,
      fixedExpenseId,
    );
  }

  @ApiOperation({
    summary: 'GET ALL - get all expenses',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter expenses starting from this date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter expenses ending until this date',
  })
  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ expenses: Expense[]; count: number }> {
    return this.expenseService.findAllExpenses(startDate, endDate);
  }

  @ApiOperation({
    summary: 'GET ONE - Retrieve Expense by ID',
  })
  @Get(':id')
  async getExpenseById(
    @Param('id') expenseId: string,
  ): Promise<Expense | null> {
    return this.expenseService.getExpenseById(expenseId);
  }

  @ApiOperation({
    summary: 'UPDATE - Update a specific expense',
  })
  @Patch(':expenseId')
  async updateExpense(
    @Param('expenseId') expenseId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return this.expenseService.updateExpense(expenseId, updateExpenseDto);
  }

  @ApiOperation({
    summary: 'DELETE - Delete a specific expense',
  })
  @Delete(':expenseId')
  async deleteExpense(@Param('expenseId') expenseId: string): Promise<void> {
    return this.expenseService.deleteExpense(expenseId);
  }
}

@ApiTags('Incomes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'income', version: '1' })
export class IncomesController {
  constructor(
    private readonly incomeService: IncomeService,
    @InjectRepository(FranchiseOwnership)
    private readonly DigifranchiseRepository: Repository<FranchiseOwnership>,
  ) {}

  @ApiOperation({
    summary: 'CREATE - Record Income for User',
  })
  @Post()
  async create(@Req() req: Request, @Body() createIncomeDto: CreateIncomeDto) {
    const userId = (req.user as User).id;
    const franchiseAccount = await getDigifranchiseAccountByUserId(
      this.DigifranchiseRepository,
      userId,
    );

    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    return this.incomeService.createIncome(createIncomeDto, userId);
  }

  @ApiOperation({
    summary: 'GET ALL - Retrieve all incomes',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter incomes starting from this date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter incomes ending until this date',
  })
  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ incomes: Income[]; count: number }> {
    return this.incomeService.findAllIncomes(startDate, endDate);
  }

  @ApiOperation({
    summary: 'GET ONE - Retrieve Income by ID',
  })
  @Get(':id')
  async getIncomeById(@Param('id') incomeId: string): Promise<Income | null> {
    return this.incomeService.getIncomeById(incomeId);
  }

  @ApiOperation({
    summary: 'UPDATE - Update a specific income',
  })
  @Patch(':incomeId')
  async update(
    @Param('incomeId') incomeId: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ): Promise<Income> {
    return this.incomeService.updateIncome(incomeId, updateIncomeDto);
  }

  @ApiOperation({
    summary: 'DELETE - Delete a specific income',
  })
  @Delete(':incomeId')
  async delete(@Param('incomeId') incomeId: string): Promise<void> {
    return this.incomeService.deleteIncome(incomeId);
  }
}

@ApiTags('Fundings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'funding', version: '1' })
export class FundingsController {
  constructor(
    private readonly fundingService: FundingService,
    @InjectRepository(FranchiseOwnership)
    private readonly DigifranchiseRepository: Repository<FranchiseOwnership>,
  ) {}

  @ApiOperation({
    summary: 'CREATE - Record Funding for User',
  })
  @Post()
  async create(
    @Req() req: Request,
    @Body() createFundingDto: CreateFundingDto,
  ) {
    const userId = (req.user as User).id;
    const franchiseAccount = await this.DigifranchiseRepository.findOne({
      where: { userId: userId },
    });

    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    return this.fundingService.createFunding(createFundingDto, userId);
  }

  @ApiOperation({
    summary: 'GET ALL - Retrieve all fundings',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter fundings starting from this date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter fundings ending until this date',
  })
  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ fundings: Funding[]; count: number }> {
    return this.fundingService.findAllFundings(startDate, endDate);
  }

  @ApiOperation({
    summary: 'GET ONE - Retrieve Funding by ID',
  })
  @Get(':id')
  async getFundingById(
    @Param('id') fundingId: string,
  ): Promise<Funding | null> {
    return this.fundingService.getFundingById(fundingId);
  }

  @ApiOperation({
    summary: 'UPDATE - Update a specific funding',
  })
  @Put(':fundingId')
  async updateFunding(
    @Param('fundingId') fundingId: string,
    @Body() updateFundingDto: UpdateFundingDto,
   ): Promise<Funding> {
    return this.fundingService.updateFunding(fundingId, updateFundingDto);
  }

  @ApiOperation({
    summary: 'DELETE - Delete a specific funding',
  })
  @Delete(':fundingId')
  async deleteFunding(@Param('fundingId') fundingId: string): Promise<void> {
    return this.fundingService.deleteFunding(fundingId);
  }


}

@ApiTags('Deposits')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'deposit', version: '1' })
export class DepositsController {
  constructor(
    private readonly depositService: DepositService,
    @InjectRepository(FranchiseOwnership)
    private readonly DigifranchiseRepository: Repository<FranchiseOwnership>,
  ) {}

  @ApiOperation({
    summary: 'CREATE - Record Deposit for User',
  })
  @Post()
  async create(
    @Req() req: Request,
    @Body() createDepositDto: CreateDepositDto,
  ) {
    const userId = (req.user as User).id;
    const franchiseAccount = await this.DigifranchiseRepository.findOne({
      where: { userId: userId },
    });

    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    return this.depositService.createDeposit(createDepositDto, userId);
  }

  @ApiOperation({
    summary: 'GET ALL - Retrieve all deposits',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter deposits starting from this date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter deposits ending until this date',
  })
  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ deposits: Deposit[]; count: number }> {
    return this.depositService.findAllDeposits(startDate, endDate);
  }

  @ApiOperation({
    summary: 'GET ONE - Retrieve Deposit by ID',
  })
  @Get(':id')
  async getDepositById(
    @Param('id') depositId: string,
  ): Promise<Deposit | null> {
    return this.depositService.getDepositById(depositId);
  }
@ApiOperation({
    summary: 'UPDATE - Update a specific deposit',
  })
  @Put(':depositId')
  async updateDeposit(
    @Param('depositId') depositId: string,
    @Body() updateDepositDto: UpdateDepositDto,
   ): Promise<Deposit> {
    return this.depositService.updateDeposit(depositId, updateDepositDto);
  }
  @ApiOperation({
    summary: 'DELETE - Delete a specific deposit',
  })
  @Delete(':depositId')
  async deleteDeposit(@Param('depositId') depositId: string): Promise<void> {
    return this.depositService.deleteDeposit(depositId);
  }
  
}

@ApiTags('OperatingParameters')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'operating-parameters', version: '1' })
export class OperatingParametersController {
  constructor(
    private readonly operatingParametersService: OperatingParametersService,
    @InjectRepository(FranchiseOwnership)
    private readonly DigifranchiseRepository: Repository<FranchiseOwnership>,
  ) {}

  @ApiOperation({
    summary: 'CREATE - Record Operating Parameters for User',
  })
  @Post()
  async create(
    @Req() req: Request,
    @Body() createOperatingParametersDto: CreateOperatingParametersDto,
  ) {
    const userId = (req.user as User).id;
    const franchiseAccount = await this.DigifranchiseRepository.findOne({
      where: { userId: userId },
    });

    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    return this.operatingParametersService.createOperatingParameters(
      createOperatingParametersDto,
      userId,
    );
  }

  @ApiOperation({
    summary: 'GET ALL - Retrieve all operating parameters',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter operating parameters starting from this date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter operating parameters ending until this date',
  })
  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ parameters: OperatingParameters[]; count: number }> {
    return this.operatingParametersService.findAllOperatingParameters(
      startDate,
      endDate,
    );
  }

  @ApiOperation({
    summary: 'GET ONE - Retrieve Operating Parameters by ID',
  })
  @Get(':id')
  async getOperatingParametersById(
    @Param('id') parametersId: string,
  ): Promise<OperatingParameters | null> {
    return this.operatingParametersService.getOperatingParametersById(
      parametersId,
    );
  }

 @ApiOperation({
    summary: 'UPDATE - Update a specific operating parameters',
  })
  @Put(':parametersId')
  async updateOperatingParameters(
    @Param('parametersId') parametersId: string,
    @Body() updateOperatingParametersDto: UpdateOperatingParametersDto,
   ): Promise<OperatingParameters> {
    return this.operatingParametersService.updateOperatingParameters(parametersId, updateOperatingParametersDto);
  }
  @ApiOperation({
    summary: 'DELETE - Delete a specific operating parameters',
  })
  @Delete(':parametersId')
  async deleteOperatingParameters(
    @Param('parametersId') parametersId: string,
   ): Promise<void> {
    return this.operatingParametersService.deleteOperatingParameters(parametersId);
  }
}
