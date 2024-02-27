import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/domain/user';
import { ManagerFixedExpensesController, ClientFixedExpensesController, ExpensesController, IncomesController, FundingsController, DepositsController, OperatingParametersController } from './accounting.controller';
import { DepositService } from './deposit.service';
import { FixedExpenseCategory } from './entities/fixedExpenseCategory.entity';
import { ExpenseService } from './expenses.service';
import { ManagerFixedExpensesService, ClientFixedExpensesService } from './fixed-expenses.service';
import { FundingService } from './funding.service';
import { IncomeService } from './income.service';
import { OperatingParametersService } from './operating-parameters.service';
import { Deposit } from './entities/deposit.entity';
import { Expense } from './entities/expense.entity';
import { Funding } from './entities/funding.entity';
import { Income } from './entities/income.entity';
import { OperatingParameters } from './entities/operationParamenters.entity';
import { FranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      FixedExpenseCategory,
      User,
      Expense,
      FranchiseOwner,
      Income,
      Funding,
      Deposit,
      OperatingParameters,
    ]),
  ],
  controllers: [
    ManagerFixedExpensesController,
    ClientFixedExpensesController,
    ExpensesController,
    IncomesController,
    FundingsController,
    DepositsController,
    OperatingParametersController,
  ],
  providers: [
    ManagerFixedExpensesService,
    ClientFixedExpensesService,
    ExpenseService,
    IncomeService,
    FundingService,
    DepositService,
    OperatingParametersService,
  ],
})
export class AccountingModule {

}
