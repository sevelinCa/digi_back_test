import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';
import { CreateOrderTableDto, UpdateOrderTableDto } from './dto/order.dto';
import { OrderTable } from './entities/order.entity';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseProduct } from 'src/digifranchise/entities/digifranchise-product.entity';
import { DigifranchiseServiceOffered } from 'src/digifranchise/entities/digifranchise-service.entity';
import { RateTable } from './entities/rate.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';

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

   ) { }

   async createOrder(createOrderTableDto: CreateOrderTableDto, userId: string, productOrServiceId: string): Promise<OrderTable> {
      const user = await checkIfUserExists(this.userRepository, userId);
      if (!user) {
          throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }
  
      let productOrService;
      let productOrServiceType;
  
      productOrService = await this.digifranchiseProductRepository.findOne({ where: { id: productOrServiceId } });
      if (productOrService) {
          productOrServiceType = 'product';
      } else {
          productOrService = await this.digifranchiseServiceRepository.findOne({ where: { id: productOrServiceId } });
          if (productOrService) {
              productOrServiceType = 'service';
          }
      }
  
      if (!productOrService) {
          throw new HttpException('Product or service does not exist', HttpStatus.NOT_FOUND);
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
      } else {
          unitPrice = productOrService.unitPrice;
      }
  
      const quantity = createOrderTableDto.quantity;
      const totalAmount = Number(unitPrice) * Number(quantity);
      const vatAmount = (Number(unitPrice) * Number(quantity)) * ((vatRate as number) / 100);
  
      const newOrder = this.orderRepository.create({
        ...createOrderTableDto,
        userId: user,
        productId: productOrServiceType === 'product' ? productOrService : null,
        serviceId: productOrServiceType === 'service' ? productOrService : null,
        unitPrice: unitPrice,
        vatAmount: vatAmount,
        totalAmount,
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
