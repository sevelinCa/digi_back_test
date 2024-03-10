import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAvailabilityManagementDto } from './dto/create-availability-management.dto';
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
    
        const digifranchise = await this.DigifranchiseRepository.findOne({where:{id:digifranchiseId}})
        if(!digifranchise){
            throw new Error('Digifranchise does not exist')
        }
    
        // Log the incoming DTO to inspect its value
        console.log('Incoming DTO:', createAvailabilityManagementDto);
    
        const newAvailability = this.availabilityRepository.create({
            ...createAvailabilityManagementDto,
            userId: user, 
            digifranchiseId: digifranchise
        });
    
        // Log the newAvailability object to inspect its values before saving
        console.log('New Availability Object:', newAvailability);
    
        const savedAvailability = await this.availabilityRepository.save(newAvailability);
        return savedAvailability;
    }
}
