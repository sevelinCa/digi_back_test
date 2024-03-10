import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Repository, IsNull } from 'typeorm';
import { CustomerManagement } from './entities/customer-management.entity';
import { CreateCustomerManagementDto, type UpdateCustomerManagementDto } from './dto/create-customer-management.dto';

@Injectable()
export class CustomerManagementService {


    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(Digifranchise)
        private readonly digifranchiseRepository: Repository<Digifranchise>,
        @InjectRepository(CustomerManagement)
        private readonly customerManagementRepository: Repository<CustomerManagement>,

    ) { }

    async createCustomer(userId: string, digifranchiseId: string, createCustomerManagementDto: CreateCustomerManagementDto): Promise<CustomerManagement> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } })
        if (!digifranchise) {
            throw new Error('Digifranchise does not exist')
        }

        const newCustomer = this.customerManagementRepository.create({
            ...createCustomerManagementDto,
            userId: user,
            digifranchiseId: digifranchise
        });

        const savedCustomer = await this.customerManagementRepository.save(newCustomer);
        return savedCustomer;
    }



}
