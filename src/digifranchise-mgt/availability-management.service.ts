import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateAvailabilityManagementDto, type UpdateAvailabilityManagementDto } from './dto/create-availability-management.dto';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { AvailableManagement } from './entities/available-management.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';

@Injectable()
export class AvailabilityManagementService {

    constructor(
        @InjectRepository(AvailableManagement)
        private readonly availabilityRepository: Repository<AvailableManagement>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(Digifranchise)
        private readonly DigifranchiseRepository: Repository<Digifranchise>,
    ) { }


    async createAvailability(userId: string, digifranchiseId: string, createAvailabilityManagementDto: CreateAvailabilityManagementDto): Promise<AvailableManagement> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        const digifranchise = await this.DigifranchiseRepository.findOne({ where: { id: digifranchiseId } })
        if (!digifranchise) {
            throw new Error('Digifranchise does not exist')
        }

        const newAvailability = this.availabilityRepository.create({
            ...createAvailabilityManagementDto,
            userId: user,
            digifranchiseId: digifranchise
        });

        const savedAvailability = await this.availabilityRepository.save(newAvailability);
        return savedAvailability;
    }

    async getAllAvailability(): Promise<AvailableManagement[]> {
        return this.availabilityRepository.find({ where: { deleteAt: IsNull() } });
    }

    async getOneAvailabiltyById(availabilityId: string): Promise<AvailableManagement | null> {
        return this.availabilityRepository.findOne({ where: { id: availabilityId, deleteAt: IsNull() } });
    }



    async updateAvailability(availabilityId: string, updateAvailabilityManagementDto: UpdateAvailabilityManagementDto): Promise<AvailableManagement> {
        const availability = await this.availabilityRepository.findOne({ where: { id: availabilityId, deleteAt: IsNull() } });
        if (!availability) {
            throw new NotFoundException(`availability with ID ${availabilityId} not found or has been soft deleted.`);
        }
    
        this.availabilityRepository.merge(availability, updateAvailabilityManagementDto);
    
        const updatedAvailability = await this.availabilityRepository.save(availability);
    
        return updatedAvailability;
     }

    async deleteVenue(availabilityId: string): Promise<void> {
        const availability = await this.availabilityRepository.findOne({ where: { id: availabilityId } });
        if (!availability) {
            throw new NotFoundException(`availability with ID ${availabilityId} not found.`);
        }
        availability.deleteAt = new Date();
        await this.availabilityRepository.save(availability);
    }

}
