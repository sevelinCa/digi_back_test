import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { OrderTable } from "src/payment/entities/order.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class TransactionsHelperService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(OrderTable)
    private readonly orderRepository: Repository<OrderTable>
  ) {}

  async getOrderBasicInfo(orderId: string): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException("Order or ownedDigifranchise not found");
    }

    const basicInfoObj = order.orderAdditionalInfo.find(
      (info) => info.basic_info !== undefined
    );

    if (!basicInfoObj || !basicInfoObj.basic_info) {
      throw new Error("Basic info not found in orderAdditionalInfo");
    }

    return basicInfoObj.basic_info;
  }

  async getUserEmailFromOrderId(orderId: string): Promise<string> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ["userId"],
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (!order.userId?.id) {
      throw new BadRequestException("Order userId is missing");
    }

    const user = await this.userRepository.findOne({
      where: { id: order.userId.id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.email) {
      throw new BadRequestException("User email is missing");
    }

    return user.email;
  }


}
