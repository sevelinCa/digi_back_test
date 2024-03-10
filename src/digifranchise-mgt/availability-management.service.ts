import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateAvailabilityManagementDto, type UpdateAvailabilityManagementDto } from './dto/create-availability-management.dto';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { AvailableManagement } from './entities/available-management.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { CreateUnavailableManagementDto } from './dto/create-unavailable-Management.dto';
import  { UnavailableManagementService } from './unavailability-management.service';
import { UnavailableManagement } from './entities/unavailable-management.entity';

@Injectable()
export class AvailabilityManagementService {

    constructor(
        @InjectRepository(AvailableManagement)
        private readonly availabilityRepository: Repository<AvailableManagement>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(Digifranchise)
        private readonly digifranchiseRepository: Repository<Digifranchise>,
        @InjectRepository(UnavailableManagement) 
        private readonly unavailableManagementRepository: Repository<UnavailableManagement>,
    
    ) { }


    async createAvailabilit(userId: string, digifranchiseId: string, createAvailabilityManagementDto: CreateAvailabilityManagementDto): Promise<AvailableManagement> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } })
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

    async createAvailability(userId: string, digifranchiseId: string, createAvailabilityManagementDto: CreateAvailabilityManagementDto): Promise<AvailableManagement> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
          throw new Error('User does not exist');
        }
    
        const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } })
        if (!digifranchise) {
          throw new Error('Digifranchise does not exist')
        }
    
        const newAvailability = this.availabilityRepository.create({
          ...createAvailabilityManagementDto,
          userId: user,
          digifranchiseId: digifranchise
        });
    
        const savedAvailability = await this.availabilityRepository.save(newAvailability);
    
        // Create and save UnavailableManagement
        const newUnavailableManagement = this.unavailableManagementRepository.create({
          userId: user,
          digifranchiseId: digifranchise,
          AvailableManagementId: savedAvailability,
          unavailableTime: createAvailabilityManagementDto.unavailableTime, // Assuming this field is part of the DTO
        });
    
        await this.unavailableManagementRepository.save(newUnavailableManagement);
    
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

    async deleteAvailability(availabilityId: string): Promise<void> {
        const availability = await this.availabilityRepository.findOne({ where: { id: availabilityId } });
        if (!availability) {
            throw new NotFoundException(`availability with ID ${availabilityId} not found.`);
        }
        availability.deleteAt = new Date();
        await this.availabilityRepository.save(availability);
    }

}
