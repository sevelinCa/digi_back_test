import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';
import { CreateOrderTableDto, UpdateOrderTableDto } from './dto/order.dto';
import { OrderTable } from './entities/order.entity';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseProduct } from 'src/digifranchise/entities/digifranchise-product.entity';
import { RateTable } from './entities/tax-rate.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from 'src/digifranchise/entities/digifranchise-service-offered.entity';
import { DigifranchiseServiceCategory } from 'src/digifranchise/entities/digifranchise-service-category.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(OrderTable)
        private readonly orderRepository: Repository<OrderTable>,
        @InjectRepository(DigifranchiseProduct)
        private readonly digifranchiseProductRepository: Repository<DigifranchiseProduct>,
        @InjectRepository(DigifranchiseServiceOffered)
        private readonly digifranchiseServiceRepository: Repository<DigifranchiseServiceOffered>,
        @InjectRepository(RateTable)
        private readonly rateTableRepository: Repository<RateTable>,
        @InjectRepository(Digifranchise)
        private readonly digifranchiseRepository: Repository<Digifranchise>,

        @InjectRepository(DigifranchiseServiceCategory)
        private readonly digifranchiseServiceCategoryRepository: Repository<DigifranchiseServiceCategory>,


    ) { }



    async createOrder(createOrderTableDto: CreateOrderTableDto, userId: string, productOrServiceOrCategoryId: string): Promise<OrderTable> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
    
        let productOrServiceOrCategory;
        let productOrServiceOrCategoryType;
    
        // Attempt to fetch a product
        productOrServiceOrCategory = await this.digifranchiseProductRepository.findOne({ where: { id: productOrServiceOrCategoryId } });
        if (productOrServiceOrCategory) {
            productOrServiceOrCategoryType = 'product';
        } else {
            // Attempt to fetch a service category
            const serviceCategory = await this.digifranchiseServiceCategoryRepository.findOne({ 
                where: { id: productOrServiceOrCategoryId }, 
                relations: ['service'] 
            });
            if (serviceCategory && serviceCategory.service) {
                productOrServiceOrCategory = serviceCategory.service;
                productOrServiceOrCategoryType = 'service';
            } else {
                // Attempt to fetch a service offered
                productOrServiceOrCategory = await this.digifranchiseServiceRepository.findOne({ where: { id: productOrServiceOrCategoryId } });
                if (productOrServiceOrCategory) {
                    productOrServiceOrCategoryType = 'service';
                } else {
                    throw new HttpException('Product, service category, or service offered does not exist', HttpStatus.NOT_FOUND);
                }
            }
        }
    
        const franchise = await this.digifranchiseRepository.findOne({ where: { id: productOrServiceOrCategory.franchiseId } });
        if (!franchise) {
            throw new HttpException('Franchise does not exist', HttpStatus.NOT_FOUND);
        }
    
        const vatRateRecord = await this.rateTableRepository.findOne({
            where: { rateName: 'VAT', deleteAt: IsNull() },
        });
    
        if (!vatRateRecord) {
            throw new HttpException('VAT rate not found', HttpStatus.NOT_FOUND);
        }
    
        const vatRate = vatRateRecord.rateNumber;
    
        let unitPrice;
        if (productOrServiceOrCategoryType === 'product') {
            unitPrice = productOrServiceOrCategory.unitPrice;
        } else if (productOrServiceOrCategoryType === 'service') {
            unitPrice = productOrServiceOrCategory.unitPrice;
        }
    
        const quantity = createOrderTableDto.quantity;
        const totalAmount = Number(unitPrice) * Number(quantity);
        const vatAmount = (Number(unitPrice) * Number(quantity)) * ((vatRate as number) / 100);
    
        const lastOrder = await this.orderRepository.find({
            order: { orderNumber: 'DESC' },
            take: 1, 
        });
    
        const nextOrderNumber = lastOrder.length > 0 ? lastOrder[0].orderNumber + 1 : 1;
    
        const newOrder = this.orderRepository.create({
            ...createOrderTableDto,
            userId: user,
            productId: productOrServiceOrCategoryType === 'product' ? productOrServiceOrCategory : null,
            serviceId: productOrServiceOrCategoryType === 'service' ? productOrServiceOrCategory : null,
            unitPrice: unitPrice,
            vatAmount: vatAmount,
            totalAmount,
            orderNumber: nextOrderNumber,
        });
    
        const savedOrder = await this.orderRepository.save(newOrder);
        return savedOrder;
    }


    async getAllOrders(userId: string): Promise<OrderTable[]> {
        return this.orderRepository.find({
            where: { userId: Equal(userId), deleteAt: IsNull() },
            relations: ['userId', 'productId', 'serviceId']
        });
    }

    async getOneOrder(orderId: string): Promise<OrderTable | null> {
        return this.orderRepository.findOne({
            where: { id: orderId, deleteAt: IsNull() },
            relations: ['userId', 'productId', 'serviceId']
        });
    }


    async updateOrder(orderId: string, updateOrderTableDto: UpdateOrderTableDto): Promise<OrderTable> {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        this.orderRepository.merge(order, updateOrderTableDto);
        return this.orderRepository.save(order);
    }


    async deleteOrder(orderId: string): Promise<void> {
        const result = await this.orderRepository.delete(orderId);
        if (result.affected === 0) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
    }
}
