import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { DigifranchiseSubProduct } from 'src/digifranchise/entities/digifranchise-sub-product.entity';
import { DigifranchiseSubServices } from 'src/digifranchise/entities/digifranchise-sub-service.entity';
import { DigifranchiseSubServiceCategory } from 'src/digifranchise/entities/digifranchise-sub-service-category.entity';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { MailService } from 'src/mail/mail.service';

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
        @InjectRepository(DigifranchiseOwner)
        private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,

        @InjectRepository(DigifranchiseSubProduct)
        private readonly digifranchiseSubProductRepository: Repository<DigifranchiseSubProduct>,
        @InjectRepository(DigifranchiseSubServices)
        private readonly digifranchiseSubServicesRepository: Repository<DigifranchiseSubServices>,
        @InjectRepository(DigifranchiseSubServiceCategory)
        private readonly digifranchiseServiceSubCategoryRepository: Repository<DigifranchiseSubServiceCategory>,

        @Inject(MailService)
        private readonly mailService: MailService,
    ) { }

    async createOrder(
        createOrderTableDto: CreateOrderTableDto,
        productOrServiceId: string,
        ownedDigifranchiseId: string
    ): Promise<OrderTable> {
        let productOrService;
        let productOrServiceType;

        productOrService = await this.digifranchiseProductRepository.findOne({
            where: { id: productOrServiceId }
        });

        if (productOrService) {
            productOrServiceType = 'product';
        } else {
            productOrService = await this.digifranchiseServiceRepository.findOne({ where: { id: productOrServiceId } });
            if (productOrService) {
                productOrServiceType = 'service';
            } else {
                throw new HttpException('Product or service offered does not exist', HttpStatus.NOT_FOUND);
            }
        }

        const franchise = await this.digifranchiseRepository.findOne({ where: { id: productOrService.franchiseId } });
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
        if (productOrServiceType === 'product') {
            unitPrice = productOrService.unitPrice;
        } else if (productOrServiceType === 'service') {
            unitPrice = productOrService.unitPrice;
        }

        const quantity = createOrderTableDto.quantity;
        const totalAmount = Number(unitPrice) * Number(quantity);
        const vatAmount = (Number(unitPrice) * Number(quantity)) * ((vatRate as number) / 100);

        const lastOrder = await this.orderRepository.find({
            order: { orderNumber: 'DESC' },
            take: 1,
        });

        const nextOrderNumber = lastOrder.length > 0 ? lastOrder[0].orderNumber + 1 : 1;


        const owned = await this.digifranchiseOwnerRepository.findOne({
            where: { id: Equal(ownedDigifranchiseId) },
        });

        if (!owned) {
            throw new HttpException('Digifranchise owner not found', HttpStatus.NOT_FOUND);
        }

        const newOrder = this.orderRepository.create({
            ...createOrderTableDto,
            productId: productOrServiceType === 'product' ? productOrService : null,
            serviceId: productOrServiceType === 'service' ? productOrService : null,
            unitPrice: unitPrice,
            vatAmount: vatAmount,
            totalAmount,
            orderNumber: nextOrderNumber,
            ownedDigifranchise: owned
        });

        // Extract the user's email from the orderAdditionalInfo array
        const userEmail = createOrderTableDto.orderAdditionalInfo.find(info => info.Email)?.Email;
        if (!userEmail) {
            throw new HttpException('User email not found in order additional info', HttpStatus.BAD_REQUEST);
        }

        const savedOrder = await this.orderRepository.save(newOrder);
        // Use the extracted userEmail to send the confirmation email
        await this.mailService.sendMailToConfirmCreatedOrder({
            to: userEmail, // Use the extracted user's email
            data: {
                orderNumber: savedOrder.orderNumber,
                email: userEmail, // Use the extracted user's email
            },
        });

        return savedOrder;
    }

    async createOrderForSubs(createOrderTableDto: CreateOrderTableDto, subProductOrSubServiceOrSubCategoryId: string): Promise<OrderTable> {

        let subProductOrSubServiceOrSubCategory;
        let subProductOrSubServiceOrSubCategoryType;

        subProductOrSubServiceOrSubCategory = await this.digifranchiseSubProductRepository.findOne({
            where: { id: subProductOrSubServiceOrSubCategoryId }
        });
        if (subProductOrSubServiceOrSubCategory) {
            subProductOrSubServiceOrSubCategoryType = 'subProduct';
        } else {
            subProductOrSubServiceOrSubCategory = await this.digifranchiseSubServicesRepository.findOne({
                where: { id: subProductOrSubServiceOrSubCategoryId },
            });
            if (subProductOrSubServiceOrSubCategory) {
                subProductOrSubServiceOrSubCategoryType = 'subService';
            } else {
                const serviceSubCategory = await this.digifranchiseServiceSubCategoryRepository.findOne({
                    where: { id: subProductOrSubServiceOrSubCategoryId },
                    relations: ['subService']
                });
                if (serviceSubCategory && serviceSubCategory.subService) {
                    subProductOrSubServiceOrSubCategory = serviceSubCategory.subService;
                    subProductOrSubServiceOrSubCategoryType = 'subService';
                } else {
                    throw new HttpException('Sub-product, sub-service category, or sub-service offered does not exist', HttpStatus.NOT_FOUND);
                }
            }
        }

        const franchise = await this.digifranchiseRepository.findOne({ where: { id: subProductOrSubServiceOrSubCategory.franchiseId } });
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
        if (subProductOrSubServiceOrSubCategoryType === 'subProduct') {
            unitPrice = subProductOrSubServiceOrSubCategory.unitPrice;
        } else if (subProductOrSubServiceOrSubCategoryType === 'subService') {
            unitPrice = subProductOrSubServiceOrSubCategory.unitPrice;
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
            subProduct: subProductOrSubServiceOrSubCategoryType === 'subProduct' ? subProductOrSubServiceOrSubCategory.id : null,
            subService: subProductOrSubServiceOrSubCategoryType === 'subService' ? subProductOrSubServiceOrSubCategory.id : null,
            unitPrice: unitPrice,
            vatAmount: vatAmount,
            totalAmount,
            orderNumber: nextOrderNumber,
        });

        const savedOrder = await this.orderRepository.save(newOrder);
        return savedOrder;
    }

    async createOrderWithAuth(
        createOrderTableDto: CreateOrderTableDto,
        userId: string,
        productOrServiceOrCategoryId: string,
        ownedDigifranchiseId: string): Promise<OrderTable> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }

        let productOrServiceOrCategory;
        let productOrServiceOrCategoryType;

        productOrServiceOrCategory = await this.digifranchiseProductRepository.findOne({
            where: { id: productOrServiceOrCategoryId }
        });
        if (productOrServiceOrCategory) {
            productOrServiceOrCategoryType = 'product';
        } else {
            const serviceCategory = await this.digifranchiseServiceCategoryRepository.findOne({
                where: { id: productOrServiceOrCategoryId },
                relations: ['service']
            });
            if (serviceCategory && serviceCategory.service) {
                productOrServiceOrCategory = serviceCategory.service;
                productOrServiceOrCategoryType = 'service';
            } else {
                productOrServiceOrCategory = await this.digifranchiseServiceRepository.findOne({ where: { id: productOrServiceOrCategoryId } });
                if (productOrServiceOrCategory) {
                    productOrServiceOrCategoryType = 'service';
                } else {
                    throw new HttpException('Product, service category, or service offered does not exist', HttpStatus.NOT_FOUND);
                }
            }
        }

        if (!productOrServiceOrCategory) {
            throw new HttpException('Product, service category, or service offered does not exist', HttpStatus.NOT_FOUND);
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


        const owned = await this.digifranchiseOwnerRepository.findOne({
            where: { id: Equal(ownedDigifranchiseId) },
        });

        if (!owned) {
            throw new HttpException('Digifranchise owner not found', HttpStatus.NOT_FOUND);
        }
        const newOrder = this.orderRepository.create({
            ...createOrderTableDto,
            userId: user,
            productId: productOrServiceOrCategoryType === 'product' ? productOrServiceOrCategory : null,
            serviceId: productOrServiceOrCategoryType === 'service' ? productOrServiceOrCategory : null,
            unitPrice: unitPrice,
            vatAmount: vatAmount,
            totalAmount,
            orderNumber: nextOrderNumber,
            ownedDigifranchise: owned
        });

        const savedOrder = await this.orderRepository.save(newOrder);
        return savedOrder;
    }


    async getAllOrders(ownedDigifranchiseId: string): Promise<{ orders: OrderTable[], count: number }> {
        const orders = await this.orderRepository.find({
            where: {
                deleteAt: IsNull(),
                ownedDigifranchise: Equal(ownedDigifranchiseId)
            },
            relations: [
                'userId',
                'productId',
                'productId.productGalleryImages',
                'serviceId',
                'serviceId.serviceGalleryImages'
            ]
        });
        return { orders, count: orders.length };
    }


    async getOneOrder(orderId: string): Promise<OrderTable | null> {
        return this.orderRepository.findOne({
            where: { id: orderId, deleteAt: IsNull() },
            relations: [
                'userId',
                'productId',
                'productId.productGalleryImages',
                'serviceId',
                'serviceId.serviceGalleryImages'
            ]
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

    async getOrderByOrderNumber(orderNumber: number, ownedFranchiseId: string): Promise<OrderTable | null> {
        return this.orderRepository.findOne({
            where: { orderNumber: orderNumber, ownedDigifranchise: Equal(ownedFranchiseId) },
            relations: ['ownedDigifranchise']
        });
    }

    async getAllOrdersWithAuth(ownedDigifranchiseId: string): Promise<{ orders: OrderTable[], count: number }> {
        const orders = await this.orderRepository.find({
            where: {
                ownedDigifranchise: Equal(ownedDigifranchiseId),
                deleteAt: IsNull()
            },
            relations: [
                'userId',
                'productId',
                'productId.productGalleryImages',
                'serviceId',
                'serviceId.serviceGalleryImages'
            ]
        });
        return { orders, count: orders.length };
    }

    async getAllOrdersWithAuthAndUser(userId: string, ownedDigifranchiseId: string): Promise<{ orders: OrderTable[], count: number }> {
        const owned = await this.digifranchiseOwnerRepository.findOne({ where: { id: ownedDigifranchiseId } })
        if (!owned) {
            throw new HttpException('Owned does not exist', HttpStatus.NOT_FOUND);
        }
        const orders = await this.orderRepository.find({
            where: {
                userId: Equal(userId),
                ownedDigifranchise: Equal(owned.id),
                deleteAt: IsNull()
            },
            relations: [
                'userId',
                'productId',
                'productId.productGalleryImages',
                'serviceId',
                'serviceId.serviceGalleryImages'
            ]
        });

        return { orders, count: orders.length };
    }

    async deleteAllOrders(): Promise<void> {
        await this.orderRepository.delete({});
    }

    async createOrderByCategory(createOrderTableDto: CreateOrderTableDto, serviceCategoryId: string, ownedDigifranchiseId: string): Promise<OrderTable> {
        let serviceCategory;
        let serviceOffered;
        let owned;

        serviceCategory = await this.digifranchiseServiceCategoryRepository.findOne({
            where: { id: serviceCategoryId },
            relations: ['service']
        });

        if (!serviceCategory) {
            throw new HttpException('Service category does not exist', HttpStatus.NOT_FOUND);
        }

        serviceOffered = serviceCategory.service;

        const unitPrice = serviceCategory.unitPrice;

        const franchise = await this.digifranchiseRepository.findOne({ where: { id: serviceOffered.digifranchiseId } });
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
        const quantity = createOrderTableDto.quantity;
        const totalAmount = Number(unitPrice) * Number(quantity);
        const vatAmount = (Number(unitPrice) * Number(quantity)) * ((vatRate as number) / 100);

        const lastOrder = await this.orderRepository.find({
            order: { orderNumber: 'DESC' },
            take: 1,
        });

        const nextOrderNumber = lastOrder.length > 0 ? lastOrder[0].orderNumber + 1 : 1;

        owned = await this.digifranchiseOwnerRepository.findOne({
            where: { id: Equal(ownedDigifranchiseId) },
        });

        if (!owned) {
            throw new HttpException('Digifranchise owner not found', HttpStatus.NOT_FOUND);
        }

        const newOrder = this.orderRepository.create({
            ...createOrderTableDto,
            serviceId: serviceOffered,
            unitPrice: unitPrice,
            vatAmount: vatAmount,
            totalAmount,
            orderNumber: nextOrderNumber,
            ownedDigifranchise: owned
        });

        const savedOrder = await this.orderRepository.save(newOrder);
        return savedOrder;
    }

    async createOrderByCategoryWithAuth(createOrderTableDto: CreateOrderTableDto, userId: string, serviceCategoryId: string, ownedDigifranchiseId: string): Promise<OrderTable> {
        const user = await checkIfUserExists(this.userRepository, userId);
        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }

        let serviceCategory;
        let serviceOffered;
        let owned;

        serviceCategory = await this.digifranchiseServiceCategoryRepository.findOne({
            where: { id: serviceCategoryId },
            relations: ['service']
        });

        if (!serviceCategory) {
            throw new HttpException('Service category does not exist', HttpStatus.NOT_FOUND);
        }

        serviceOffered = serviceCategory.service;

        const unitPrice = serviceCategory.unitPrice;

        const franchise = await this.digifranchiseRepository.findOne({ where: { id: serviceOffered.digifranchiseId } });
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
        const quantity = createOrderTableDto.quantity;
        const totalAmount = Number(unitPrice) * Number(quantity);
        const vatAmount = (Number(unitPrice) * Number(quantity)) * ((vatRate as number) / 100);

        const lastOrder = await this.orderRepository.find({
            order: { orderNumber: 'DESC' },
            take: 1,
        });

        const nextOrderNumber = lastOrder.length > 0 ? lastOrder[0].orderNumber + 1 : 1;

        owned = await this.digifranchiseOwnerRepository.findOne({
            where: { id: Equal(ownedDigifranchiseId) },
        });

        if (!owned) {
            throw new HttpException('Digifranchise owner not found', HttpStatus.NOT_FOUND);
        }

        const newOrder = this.orderRepository.create({
            ...createOrderTableDto,
            userId: user,
            serviceId: serviceOffered,
            unitPrice: unitPrice,
            vatAmount: vatAmount,
            totalAmount,
            orderNumber: nextOrderNumber,
            ownedDigifranchise: owned
        });

        const savedOrder = await this.orderRepository.save(newOrder);
        return savedOrder;
    }

}
