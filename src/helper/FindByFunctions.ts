import { Equal, Repository } from "typeorm";
import { User } from "../users/domain/user";
import { UserNotFoundException } from "src/middlewares/accounting.exceptions";
import { Expense } from "src/accounting/entities/expense.entity";
import { FixedExpenseCategory } from "src/accounting/entities/fixedExpenseCategory.entity";
import { Income } from "src/accounting/entities/income.entity";
import { Deposit } from "src/accounting/entities/deposit.entity";
import { Funding } from "src/accounting/entities/funding.entity";
import { OperatingParameters } from "src/accounting/entities/operationParamenters.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";
import { Asset } from "src/asset-mgt/entities/asset.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { RoleEnum } from "src/roles/roles.enum";

export async function findUserById(
  userRepository: Repository<User>,
  userId: string,
): Promise<User> {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) throw new UserNotFoundException(userId);
  return user;
}

export async function checkIfUserExists(
  userRepository: Repository<UserEntity>,
  userId: string,
): Promise<UserEntity | null> {
  const user = await userRepository.findOne({ where: { id: userId } });
  return user || null;
}

export async function getDigifranchiseAccountByUserId(
  DigifranchiseRepository: Repository<DigifranchiseOwner>,
  userId: string,
): Promise<DigifranchiseOwner | null> {
  const userDigifranchise = await DigifranchiseRepository.findOne({
    where: { userId: userId },
  });
  return userDigifranchise || null;
}

export async function getDigifranchiseById(
  DigifranchiseRepository: Repository<Digifranchise>,
  digifranchiseId: string,
): Promise<Digifranchise | null> {
  const digifranchise = await DigifranchiseRepository.findOne({
    where: { id: digifranchiseId },
  });
  return digifranchise || null;
}

export async function findExpenseById(
  expenseRepository: Repository<Expense>,
  expenseId: string,
): Promise<Expense | null> {
  const expense = await expenseRepository.findOne({ where: { id: expenseId } });
  return expense || null;
}

export async function findFixedExpenseCategoryById(
  fixedExpenseCategoryRepository: Repository<FixedExpenseCategory>,
  fixedExpenseCategoryId: string,
): Promise<FixedExpenseCategory | null> {
  const fixedExpenseCategory = await fixedExpenseCategoryRepository.findOne({
    where: { id: fixedExpenseCategoryId },
  });
  return fixedExpenseCategory || null;
}

export async function findIncomeById(
  incomeRepository: Repository<Income>,
  incomeId: string,
): Promise<Income | null> {
  const income = await incomeRepository.findOne({ where: { id: incomeId } });
  return income || null;
}

export async function findAssetById(
  assetRepository: Repository<Asset>,
  assetId: string,
): Promise<Asset | null> {
  const asset = await assetRepository.findOne({ where: { id: assetId } });
  return asset || null;
}

export async function findInventoryById(
  inventoryRepository: Repository<Inventory>,
  inventoryId: string,
): Promise<Inventory | null> {
  const inventory = await inventoryRepository.findOne({
    where: { id: inventoryId },
  });
  return inventory || null;
}

export async function findDepositById(
  depositRepository: Repository<Deposit>,
  depositId: string,
): Promise<Deposit | null> {
  const deposit = await depositRepository.findOne({ where: { id: depositId } });
  return deposit || null;
}
export async function findFundingById(
  fundingRepository: Repository<Funding>,
  fundingId: string,
): Promise<Funding | null> {
  const funding = await fundingRepository.findOne({ where: { id: fundingId } });
  return funding || null;
}

export async function findOperatingParametersById(
  operatingParametersRepository: Repository<OperatingParameters>,
  operatingParametersId: string,
): Promise<OperatingParameters | null> {
  const operatingParameters = await operatingParametersRepository.findOne({
    where: { id: operatingParametersId },
  });
  return operatingParameters || null;
}

export async function checkIfDigifranchiseExists(
  digifranchiseRepository: Repository<Digifranchise>,
  digifranchiseId: string,
): Promise<boolean> {
  const digifranchise = await digifranchiseRepository.findOne({
    where: { id: digifranchiseId },
  });
  return !!digifranchise;
}

export async function findAdminID(): Promise<string> {
  const admin = await this.userRepository.findOne({
    where: { role: Equal(RoleEnum.digifranchise_super_admin) },
  });
  if (!admin) {
    throw new Error("Admin user not found");
  }
  console.log("AAAAAAAAAAAAAAAAAAA", admin);
  return admin.id;
}
