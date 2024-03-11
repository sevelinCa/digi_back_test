import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import {  Repository, IsNull } from 'typeorm';
import { CreateSupplierManagementDto, UpdateSupplierManagementDto } from './dto/create-supplier-management.dto';
import { SupplierManagement } from './entities/supplier-management.entity';

@Injectable()
export class SupplierManagementService {



    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(Digifranchise)
        private readonly digifranchiseRepository: Repository<Digifranchise>,
        @InjectRepository(SupplierManagement)
        private readonly supplierManagementRepository: Repository<SupplierManagement>,

    ) { }

    async createSupplier(userId: string, digifranchiseId: string, createSupplierManagementDto: CreateSupplierManagementDto): Promise<SupplierManagement> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } })
        if (!digifranchise) {
            throw new Error('Digifranchise does not exist')
        }

        const newSupplier = this.supplierManagementRepository.create({
            ...createSupplierManagementDto,
            userId: user,
            digifranchiseId: digifranchise
        });

        const savedSupplier = await this.supplierManagementRepository.save(newSupplier);
        return savedSupplier;
    }


}
