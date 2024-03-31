import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingOrderTable } from './entities/rating-order.entity';
import  { CreateRatingOrderDto } from './dto/rating-order.dto';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { checkIfUserExists } from 'src/helper/FindByFunctions';
import { use } from 'passport';
import { OrderTable } from 'src/payment/entities/order.entity';

@Injectable()
export class RatingOrderService {
    constructor(
        @InjectRepository(RatingOrderTable)
        private readonly ratingOrderRepository: Repository<RatingOrderTable>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(OrderTable)
        private readonly orderpository: Repository<OrderTable>,
    ) { }

    async createRatingOrder(userId: string, orderId: string, createRatingOrderDto: CreateRatingOrderDto): Promise<RatingOrderTable> {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new Error('User does not exist')
        }

        const order = await this.orderpository.findOne({ where: { id: orderId } })
        if (!order) {
            throw new Error('Order does not exist')
        }

        const newRatingOrder = this.ratingOrderRepository.create({
            ...createRatingOrderDto,
            userId: user, 
            orderId: order,
        });
        return await this.ratingOrderRepository.save(newRatingOrder);
    }

    async getAllRatingOrders(): Promise<RatingOrderTable[]> {
        return await this.ratingOrderRepository.find();
    }

    async getRatingOrderById(orderId: string): Promise<RatingOrderTable> {
        const ratingOrder = await this.ratingOrderRepository.findOne({ where: { id:orderId } });
        if (!ratingOrder) {
            throw new NotFoundException(`Rating order with ID ${orderId} not found`);
        }
        return ratingOrder;
    }
}