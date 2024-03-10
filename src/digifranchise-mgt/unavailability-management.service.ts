import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Repository, IsNull } from 'typeorm';
import { AvailableManagement } from './entities/available-management.entity';
import { UnavailableManagement } from './entities/unavailable-management.entity';
import { CreateUnavailableManagementDto, UpdateUnavailableManagementDto } from './dto/create-unavailable-Management.dto';
import { checkIfUserExists } from 'src/helper/FindByFunctions';

@Injectable()
export class UnavailableManagementService {
 constructor(
    @InjectRepository(UnavailableManagement)
    private readonly unavailableManagementRepository: Repository<UnavailableManagement>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Digifranchise)
    private readonly digifranchiseRepository: Repository<Digifranchise>,
    @InjectRepository(AvailableManagement)
    private readonly availableManagementRepository: Repository<AvailableManagement>,
 ) {}

 async createUnavailableManagement(userId: string, digifranchiseId: string, createUnavailableManagementDto: CreateUnavailableManagementDto): Promise<UnavailableManagement> {
    const user = await checkIfUserExists(this.userRepository, userId);
    if (!user) {
        throw new Error('User does not exist');
    }
   
    const digifranchise = await this.digifranchiseRepository.findOne({where: {id: digifranchiseId}});
    if (!digifranchise) {
       throw new Error('Digifranchise does not exist');
    }
   
    const newUnavailableManagement = this.unavailableManagementRepository.create({
        ...createUnavailableManagementDto,
       userId:user,
       digifranchiseId:digifranchise,
    });
   
    const savedUnavailableManagement = await this.unavailableManagementRepository.save(newUnavailableManagement);
    return savedUnavailableManagement;
   }

   async getAllUnavailableManagement(): Promise<UnavailableManagement[]> {
    return this.unavailableManagementRepository.find({ where: { deleteAt: IsNull() } });
   }

}