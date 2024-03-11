import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import {  Repository, IsNull } from 'typeorm';
import  { CreateStaffManagementDto, UpdateStaffManagementDto } from './dto/create-staff-management.dto';
import { StaffManagement } from './entities/staff-management.entity';

@Injectable()
export class StaffManagementService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(Digifranchise)
        private readonly digifranchiseRepository: Repository<Digifranchise>,
        @InjectRepository(StaffManagement)
        private readonly staffManagementRepository: Repository<StaffManagement>,

    ) { }

    async createStaff(userId: string, digifranchiseId: string, createStaffManagementDto: CreateStaffManagementDto): Promise<StaffManagement> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } })
        if (!digifranchise) {
            throw new Error('Digifranchise does not exist')
        }

        const newStaff = this.staffManagementRepository.create({
            ...createStaffManagementDto,
            userId: user,
            digifranchiseId: digifranchise
        });

        const savedStaff = await this.staffManagementRepository.save(newStaff);
        return savedStaff;
    }


    async getAllStaff(): Promise<StaffManagement[]> {
        return this.staffManagementRepository.find({ where: { deleteAt: IsNull() } });
    }

    async getOneStaffById(staffId: string): Promise<StaffManagement | null> {
        return this.staffManagementRepository.findOne({ where: { id: staffId, deleteAt: IsNull() } });
    }



    async updateStaff(staffId: string, updateStaffManagementDto: UpdateStaffManagementDto): Promise<StaffManagement> {
        const staff = await this.staffManagementRepository.findOne({ where: { id: staffId, deleteAt: IsNull() } });
        if (!staff) {
            throw new NotFoundException(`staff with ID ${staffId} not found or has been soft deleted.`);
        }

        this.staffManagementRepository.merge(staff, updateStaffManagementDto);

        const updatedStaff = await this.staffManagementRepository.save(staff);

        return updatedStaff;
    }

}
