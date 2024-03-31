import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import  { Repository } from 'typeorm';
import  { CreateOrderBasicInfo } from './dto/order.dto';
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
    
    async getBasicInfoId(basicInfoId: string): Promise<OrderBasicInfo> {
        const basicInfo = await this.orderBasicInfoRepository.findOne({ 
            where: { id: basicInfoId },
            relations: ['order'] 
        });
        if (!basicInfo) {
            throw new HttpException('BasicInfo not found', HttpStatus.NOT_FOUND);
        }
        return basicInfo;
    }
}
