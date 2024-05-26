import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { checkIfUserExists } from "src/helper/FindByFunctions";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Repository, IsNull } from "typeorm";
import {
  CreateSupplierManagementDto,
  UpdateSupplierManagementDto,
} from "./dto/create-supplier-management.dto";
import { SupplierManagement } from "./entities/supplier-management.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

@Injectable()
export class SupplierManagementService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DigifranchiseOwner)
    private readonly ownedFranchiseRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(SupplierManagement)
    private readonly supplierManagementRepository: Repository<SupplierManagement>,
  ) {}

  async createSupplier(
    userId: string,
    ownedFranchiseId: string,
    createSupplierManagementDto: CreateSupplierManagementDto,
  ): Promise<SupplierManagement> {
    const user = await checkIfUserExists(this.userRepository, userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const owned = await this.ownedFranchiseRepository.findOne({
      where: { id: ownedFranchiseId },
    });
    if (!owned) {
      throw new Error("owned does not exist");
    }

    const newSupplier = this.supplierManagementRepository.create({
      ...createSupplierManagementDto,
      userId: user,
      ownedDigifranchise: owned,
    });

    const savedSupplier =
      await this.supplierManagementRepository.save(newSupplier);
    return savedSupplier;
  }

  async getAllSupplier(): Promise<SupplierManagement[]> {
    return this.supplierManagementRepository.find({
      where: { deleteAt: IsNull() },
    });
  }

  async getOneSupplierById(
    supplierId: string,
  ): Promise<SupplierManagement | null> {
    return this.supplierManagementRepository.findOne({
      where: { id: supplierId, deleteAt: IsNull() },
    });
  }

  async updateSupplier(
    supplierId: string,
    updateSupplierManagementDto: UpdateSupplierManagementDto,
  ): Promise<SupplierManagement> {
    const supplier = await this.supplierManagementRepository.findOne({
      where: { id: supplierId, deleteAt: IsNull() },
    });
    if (!supplier) {
      throw new NotFoundException(
        `supplier with ID ${supplierId} not found or has been soft deleted.`,
      );
    }

    this.supplierManagementRepository.merge(
      supplier,
      updateSupplierManagementDto,
    );

    const updatedSupplier =
      await this.supplierManagementRepository.save(supplier);

    return updatedSupplier;
  }

  async deleteSupplier(supplierId: string): Promise<void> {
    const supplier = await this.supplierManagementRepository.findOne({
      where: { id: supplierId },
    });
    if (!supplier) {
      throw new NotFoundException(`supplier with ID ${supplierId} not found.`);
    }
    supplier.deleteAt = new Date();
    await this.supplierManagementRepository.save(supplier);
  }
}
