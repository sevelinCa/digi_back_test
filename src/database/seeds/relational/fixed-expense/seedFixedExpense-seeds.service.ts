import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FixedExpenseCategory } from "src/accounting/entities/fixedExpenseCategory.entity";
import { Repository } from "typeorm";

@Injectable()
export class FixedExpenseSeedService {
  constructor(
    @InjectRepository(FixedExpenseCategory)
    private repository: Repository<FixedExpenseCategory>,
  ) {}

  async run() {
    const fixedExpenses = [
      "Accounting",
      "Advertising",
      "Bank Charges",
      "Computer Expenses",
      "Electricity/Water",
      "Internet Fees",
      "Lease Costs",
      "Legal Fees",
      "Marketing Fees",
      "Marketing Lists",
      "Office Expsenses",
      "Rent",
      "Salaries",
      "Salary Oncosts",
      "Salary",
      "Software Lease",
      "Stationery",
      "Subscriptions",
      "Telephones",
      "Travel",
      "Wages - Sundries",
      "Website",
    ];

    for (const fixedExpenseName of fixedExpenses) {
      const count = await this.repository.count({
        where: { fixedExpense: fixedExpenseName },
      });

      if (count === 0) {
        await this.repository.save(
          this.repository.create({ fixedExpense: fixedExpenseName }),
        );
      }
    }
  }
}
