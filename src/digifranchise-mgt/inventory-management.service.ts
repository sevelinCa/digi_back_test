import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import {  Repository, IsNull } from 'typeorm';
import  { CreateInventoryManagementDto, UpdateInventoryManagementDto } from './dto/create-inventory-management.dto';
import { InventoryManagement } from './entities/inventory-management.entity';

@Injectable()
export class InventoryManagementService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(Digifranchise)
        private readonly digifranchiseRepository: Repository<Digifranchise>,
        @InjectRepository(InventoryManagement)
        private readonly inventoryManagementRepository: Repository<InventoryManagement>,

    ) { }

    async createInventory(userId: string, digifranchiseId: string, createInventoryManagementDto: CreateInventoryManagementDto): Promise<InventoryManagement> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } })
        if (!digifranchise) {
            throw new Error('Digifranchise does not exist')
        }

        const newInventory = this.inventoryManagementRepository.create({
            ...createInventoryManagementDto,
            userId: user,
            digifranchiseId: digifranchise
        });

        const savedInventory = await this.inventoryManagementRepository.save(newInventory);
        return savedInventory;
    }


    async getAllInventory(): Promise<InventoryManagement[]> {
        return this.inventoryManagementRepository.find({ where: { deleteAt: IsNull() } });
    }

    async getOneInventoryById(inventoryId: string): Promise<InventoryManagement | null> {
        return this.inventoryManagementRepository.findOne({ where: { id: inventoryId, deleteAt: IsNull() } });
    }

    async updateInventory(inventoryId: string, updateInventoryManagementDto: UpdateInventoryManagementDto): Promise<InventoryManagement> {
        const inventory = await this.inventoryManagementRepository.findOne({ where: { id: inventoryId, deleteAt: IsNull() } });
        if (!inventory) {
            throw new NotFoundException(`inventory with ID ${inventoryId} not found or has been soft deleted.`);
        }

        this.inventoryManagementRepository.merge(inventory, updateInventoryManagementDto);

        const updatedInventory = await this.inventoryManagementRepository.save(inventory);

        return updatedInventory;
    }

    async deleteInventory(inventoryId: string): Promise<void> {
        const inventory = await this.inventoryManagementRepository.findOne({ where: { id: inventoryId } });
        if (!inventory) {
            throw new NotFoundException(`inventory with ID ${inventoryId} not found.`);
        }
        inventory.deleteAt = new Date();
        await this.inventoryManagementRepository.save(inventory);
    }
}
