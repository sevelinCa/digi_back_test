import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTable } from 'src/payment/entities/order.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateRatingOrderDto } from './dto/rating-order.dto';
import {
  OrderComplaintsTable,
  OrderIssueTable,
} from './entities/Complaints.entity';
import { CreateOrderComplaintsDto } from './dto/Complaints.dto';
import { getOrderUserNamesAndEmailWithOwnerEmail } from 'src/helper/Enquiry-complement-helper-functions';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';

@Injectable()
export class OrderComplaintsService {
  constructor(
    @InjectRepository(OrderComplaintsTable)
    private readonly orderComplaintsRepository: Repository<OrderComplaintsTable>,
    @InjectRepository(OrderTable)
    private readonly orderpository: Repository<OrderTable>,
    @InjectRepository(OrderTable)
    private readonly orderRepository: Repository<OrderTable>,
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(OrderIssueTable)
    private readonly orderIssuepository: Repository<OrderIssueTable>
  ) {}

  async createOrderComplaint(
    orderId: string,
    createOrderComplaintsDto: CreateOrderComplaintsDto
  ): Promise<OrderComplaintsTable> {
    const order = await this.orderpository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order does not exist');
    }
    const orderComplaints = await this.orderComplaintsRepository.findOne({
      where: { order: { id: orderId } },
    });
    if(orderComplaints){
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'You have already submitted a complaint',
        },
        HttpStatus.CONFLICT
      );
    };
    const newOrderComplaint = this.orderComplaintsRepository.create({
      ...createOrderComplaintsDto,
      order: order,
    });
    return await this.orderComplaintsRepository.save(newOrderComplaint);
  }

  async getAllOrderComplaint(): Promise<OrderComplaintsTable[]> {
    return await this.orderComplaintsRepository.find({
      where: { deleteAt: IsNull() },
      relations: ['order'],
    });
  }

  async getOrderUserNamesAndEmailWithOwnerEmail(orderId: string): Promise<{
    email: string;
    name: string;
    digifranchiseOwnerId: string;
    supportEmail: string;
  } | null> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['userId', 'ownedDigifranchise'],
    });
  
    if (!order) {
      return null;
    }
  
    const userInfo = order.orderAdditionalInfo.find((info) => info.basic_info);
  
    if (!userInfo || !userInfo.basic_info) {
      return null;
    }
  
    const digifranchiseOwnerId = order.ownedDigifranchise!.id;
  
    try {
      const supportEmail = await this.getEmailByDigifranchiseOwnerId(digifranchiseOwnerId);
  
      return {
        email: userInfo.basic_info.email,
        name: userInfo.basic_info.name,
        digifranchiseOwnerId: digifranchiseOwnerId,
        supportEmail: supportEmail,
      };
    } catch (error) {
      console.error(`Error getting owner email: ${error.message}`);
      return null;
    }
  }
  
  private async getEmailByDigifranchiseOwnerId(digifranchiseOwnerId: string): Promise<string> {
    const owner = await this.digifranchiseOwnerRepository.findOne({
      where: { id: digifranchiseOwnerId },
      select: ['userEmail'],
    });
  
    if (!owner) {
      throw new Error(`No owner found with ID: ${digifranchiseOwnerId}`);
    }
  
    return owner.userEmail;
  }
    
}
