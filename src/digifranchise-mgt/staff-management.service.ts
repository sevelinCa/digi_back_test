import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Repository, IsNull, Equal } from 'typeorm';
import { CreateStaffManagementDto, UpdateStaffManagementDto } from './dto/create-staff-management.dto';
import { StaffManagement } from './entities/staff-management.entity';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';

@Injectable()
export class StaffManagementService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(DigifranchiseOwner)
        private readonly ownedFranchiseRepository: Repository<DigifranchiseOwner>,
        @InjectRepository(StaffManagement)
        private readonly staffManagementRepository: Repository<StaffManagement>,

    ) { }

    async createStaff(userId: string, ownedFranchiseId: string, createStaffManagementDto: CreateStaffManagementDto): Promise<StaffManagement> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        const owned = await this.ownedFranchiseRepository.findOne({ where: { id: ownedFranchiseId } })
        if (!owned) {
            throw new Error('User does not exist')
        }
        const newStaff = this.staffManagementRepository.create({
            ...createStaffManagementDto,
            userId: user,
            ownedDigifranchise: owned
        });

        const savedStaff = await this.staffManagementRepository.save(newStaff);
        return savedStaff;
    }

    async getAllStaff(userId: string): Promise<StaffManagement[]> {
        return this.staffManagementRepository.find({ where: { userId: Equal(userId), deleteAt: IsNull() } });
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

    async deleteStaff(staffId: string): Promise<void> {
        const staff = await this.staffManagementRepository.findOne({ where: { id: staffId } });
        if (!staff) {
            throw new NotFoundException(`staff with ID ${staffId} not found.`);
        }
        staff.deleteAt = new Date();
        await this.staffManagementRepository.save(staff);
    }
}
