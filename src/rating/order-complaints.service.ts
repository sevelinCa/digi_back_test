import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTable } from 'src/payment/entities/order.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateRatingOrderDto } from './dto/rating-order.dto';
import { OrderComplaintsTable, OrderIssueTable } from './entities/Complaints.entity';
import  { CreateOrderComplaintsDto } from './dto/Complaints.dto';

@Injectable()
export class OrderComplaintsService {
    constructor(
        @InjectRepository(OrderComplaintsTable)
        private readonly orderComplaintsRepository: Repository<OrderComplaintsTable>,
        @InjectRepository(OrderTable)
        private readonly orderpository: Repository<OrderTable>,

        @InjectRepository(OrderIssueTable)
        private readonly orderIssuepository: Repository<OrderIssueTable>,
    ) { }

    async createOrderComplaint(orderId: string, createOrderComplaintsDto: CreateOrderComplaintsDto): Promise<OrderComplaintsTable> {
        const order = await this.orderpository.findOne({ where: { id: orderId } })
        if (!order) {
            throw new Error('Order does not exist')
        }

        const newOrderComplaint = this.orderComplaintsRepository.create({
            ...createOrderComplaintsDto,
            order: order,
        });
        return await this.orderComplaintsRepository.save(newOrderComplaint);
    }

    async getAllOrderComplaint(): Promise<OrderComplaintsTable[]> {
        return await this.orderComplaintsRepository.find({
            where: { deleteAt: IsNull() },
            relations: ['order']
        });
    }
}
