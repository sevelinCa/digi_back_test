import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Repository, IsNull, Equal } from 'typeorm';
import { CustomerManagement } from './entities/customer-management.entity';
import { CreateCustomerManagementDto, UpdateCustomerManagementDto } from './dto/create-customer-management.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';

@Injectable()
export class CustomerManagementService {


    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(DigifranchiseOwner)
        private readonly ownedFranchiseRepository: Repository<DigifranchiseOwner>,
        @InjectRepository(CustomerManagement)
        private readonly customerManagementRepository: Repository<CustomerManagement>,

    ) { }

    async createCustomer(userId: string, ownedFranchiseId: string, createCustomerManagementDto: CreateCustomerManagementDto): Promise<CustomerManagement> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        const owned = await this.ownedFranchiseRepository.findOne({ where: { id: ownedFranchiseId } })
        if (!owned) {
            throw new Error('User does not exist')
        }
        const newCustomer = this.customerManagementRepository.create({
            ...createCustomerManagementDto,
            userId: user,
            ownedDigifranchise: owned,
        });

        const savedCustomer = await this.customerManagementRepository.save(newCustomer);
        return savedCustomer;
    }

    async getAllCustomer(userId: string, ownedFranchiseId: string,): Promise<CustomerManagement[]> {

        const owned = await this.ownedFranchiseRepository.findOne({ where: { id: ownedFranchiseId } })
        if (!owned) {
            throw new Error('Owned does not exist')
        }

        return this.customerManagementRepository.find({
            where: {
                userId: Equal(userId),
                ownedDigifranchise: Equal(owned.id),
                deleteAt: IsNull()
            }
        });
    }

    async getAllCustomerByUser(userId: string): Promise<CustomerManagement[]> {
        return this.customerManagementRepository.find({
            where: {
                userId: Equal(userId),
                deleteAt: IsNull()
            }
        });
    }

    async getOneCustomerById(customerId: string): Promise<CustomerManagement | null> {
        return this.customerManagementRepository.findOne({ where: { id: customerId, deleteAt: IsNull() } });
    }

    async updateCustomer(customerId: string, updateCustomerManagementDto: UpdateCustomerManagementDto): Promise<CustomerManagement> {
        const customer = await this.customerManagementRepository.findOne({ where: { id: customerId, deleteAt: IsNull() } });
        if (!customer) {
            throw new NotFoundException(`customer with ID ${customerId} not found or has been soft deleted.`);
        }

        this.customerManagementRepository.merge(customer, updateCustomerManagementDto);

        const updatedCustomer = await this.customerManagementRepository.save(customer);

        return updatedCustomer;
    }

    async deleteCustomer(customerId: string): Promise<void> {
        const customer = await this.customerManagementRepository.findOne({ where: { id: customerId } });
        if (!customer) {
            throw new NotFoundException(`customer with ID ${customerId} not found.`);
        }
        customer.deleteAt = new Date();
        await this.customerManagementRepository.save(customer);
    }

}
