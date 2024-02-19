import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { findInventoryById, getDigifranchiseByUserId } from 'src/helper/FindByFunctions';
import { User } from 'src/users/domain/user';
import type { CreateInventoryDto } from './dto/create-inventory.dto';
import type { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Digifranchise)
    private readonly digifranchiseAccountRepository: Repository<Digifranchise>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createInventoryItem(
    createInventoryDto: CreateInventoryDto,
    userId: string,
  ): Promise<Inventory> {
    const totalValue =
      createInventoryDto.quantity * createInventoryDto.costPerItem;

    createInventoryDto.totalValue = totalValue;

    const franchiseAccount = await getDigifranchiseByUserId(
      this.digifranchiseAccountRepository,
      userId,
    );



    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    const newInventoryItem = this.inventoryRepository.create({
      ...createInventoryDto,
      franchiseId: franchiseAccount,
    });

    const savedInventoryItem = await this.inventoryRepository.save(
      newInventoryItem,
    );

    return savedInventoryItem;
  }

  async findAllInventoryItems(
    startDate?: string,
    endDate?: string,
  ): Promise<{
    inventoryItems: Inventory[];
    count: number;
  }> {
    const queryBuilder =
      this.inventoryRepository.createQueryBuilder('inventory');

    queryBuilder.leftJoinAndSelect('inventory.franchiseId', 'franchise');
    queryBuilder.leftJoinAndSelect('inventory.assetId', 'asset');

    if (startDate) {
      queryBuilder.andWhere('inventory.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('inventory.date <= :endDate', { endDate });
    }

    const inventoryItems = await queryBuilder.getMany();
    const count = await queryBuilder.getCount();

    return { inventoryItems, count };
  }

  async findInventoryById(inventoryId: string): Promise<Inventory | null> {
    return findInventoryById(this.inventoryRepository, inventoryId);
  }

  async updateInventoryItem(
    inventoryId: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventoryItem = await findInventoryById(
      this.inventoryRepository,
      inventoryId,
    );
    if (!inventoryItem) {
      throw new NotFoundException(
        `Inventory item not found with ID ${inventoryId}`,
      );
    }

    if (
      updateInventoryDto.quantity !== undefined ||
      updateInventoryDto.costPerItem !== undefined
    ) {
      const quantity = updateInventoryDto.quantity ?? inventoryItem.quantity;
      const costPerItem =
        updateInventoryDto.costPerItem ?? inventoryItem.costPerItem;
      inventoryItem.totalValue = quantity * costPerItem;
    }

    Object.assign(inventoryItem, updateInventoryDto);
    return this.inventoryRepository.save(inventoryItem);
  }

  async deleteInventoryItem(inventoryId: string): Promise<void> {
    const result = await this.inventoryRepository.delete(inventoryId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Inventory item not found with ID ${inventoryId}`,
      );
    }
  }
}
