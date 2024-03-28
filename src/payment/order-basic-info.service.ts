import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { CreateOrderBasicInfo } from './dto/order.dto';
import { OrderBasicInfo, OrderTable } from './entities/order.entity';

@Injectable()
export class OrderBasicInfoService {
        constructor(
        @InjectRepository(OrderTable)
        private readonly orderRepository: Repository<OrderTable>,
        @InjectRepository(OrderBasicInfo)
        private readonly orderBasicInfoRepository: Repository<OrderBasicInfo>,
    ) { }

    async createOrderBasicInfo(createOrderBasicInfo: CreateOrderBasicInfo, orderId: string): Promise<OrderBasicInfo> {

        const order = await this.orderRepository.findOne({ where: { id: orderId } })
        if (!order) {
            throw new HttpException('Order not exist', HttpStatus.NOT_FOUND);
        }

        const newOrderBasicInfo = this.orderBasicInfoRepository.create({
            ...createOrderBasicInfo,
            order: order
        });
        const savedOrderBasicInfo = await this.orderBasicInfoRepository.save(newOrderBasicInfo);
        return savedOrderBasicInfo;
    }

    async getAllBasicInfo(): Promise<OrderBasicInfo[]> {
        return await this.orderBasicInfoRepository.find({ relations: ['order'] });
    }
}
