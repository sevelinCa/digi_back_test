import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTable } from 'src/payment/entities/order.entity';
import { IsNull, type Repository } from 'typeorm';
import type { CreateOrderIssueDto } from './dto/Complaints.dto';
import { OrderIssueTable } from './entities/Complaints.entity';

@Injectable()
export class OrderIssueService {
    constructor(
        @InjectRepository(OrderTable)
        private readonly orderRepository: Repository<OrderTable>,
        @InjectRepository(OrderIssueTable)
        private readonly orderIssueRepository: Repository<OrderIssueTable>,
    ) { }

    async createOrderIssue(createOrderIssueDto: CreateOrderIssueDto, orderId: string): Promise<OrderIssueTable> {

        const order = await this.orderRepository.findOne({ where: { id: orderId } })
        if (!order) {
            throw new HttpException('Order not exist', HttpStatus.NOT_FOUND);
        }

        const newOrderIssue = this.orderIssueRepository.create({
            ...createOrderIssueDto,
            order: order
        });
        const savedOrderIssue = await this.orderIssueRepository.save(newOrderIssue);
        return savedOrderIssue;
    }

}
