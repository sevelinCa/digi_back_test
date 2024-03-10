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


}
