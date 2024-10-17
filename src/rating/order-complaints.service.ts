import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTable } from 'src/payment/entities/order.entity';
import { IsNull, Repository } from 'typeorm';
import {
  OrderComplaintsTable,
  OrderIssueTable,
} from './entities/Complaints.entity';
import { CreateOrderComplaintsDto } from './dto/Complaints.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { MailService } from 'src/mail/mail.service';

import { v4 as uuidv4 } from 'uuid';

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
    private readonly orderIssuepository: Repository<OrderIssueTable>,

    @Inject(MailService)
    private readonly mailService: MailService,
  ) { }



  async createOrderComplaint(
    orderId: string,
    createOrderComplaintsDto: CreateOrderComplaintsDto
  ): Promise<OrderComplaintsTable> {
    try {
      const order = await this.orderRepository.findOne({ where: { id: orderId } });
      if (!order) {
        throw new Error('Order does not exist');
      }

      const orderComplaints = await this.orderComplaintsRepository.findOne({
        where: { order: { id: orderId } },
      });
      if (orderComplaints) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            message: 'You have already submitted a complaint',
          },
          HttpStatus.CONFLICT
        );
      }

      const newOrderComplaint = this.orderComplaintsRepository.create({
        ...createOrderComplaintsDto,
        order: order,
      });
      const savedComplaint = await this.orderComplaintsRepository.save(newOrderComplaint);

      const emailData = await this.getOrderUserNamesAndEmailWithOwnerEmail(orderId);
      if (emailData) {
        const submissionDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const referenceNumber = uuidv4();
        await this.mailService.sendComplaintConfirmationEmail({
          to: emailData.email,
          supportEmail: emailData.supportEmail,
          customerName: emailData.name,
          submissionDate,
          complaintSummary: createOrderComplaintsDto.additional_information,
          complaintReferenceNumber: referenceNumber,
        });
      }

      return savedComplaint;
    } catch (error) {
      console.error('Error creating order complaint:', error);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
