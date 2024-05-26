import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RatingOrderTable } from "./entities/rating-order.entity";
import { CreateRatingOrderDto } from "./dto/rating-order.dto";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { checkIfUserExists } from "src/helper/FindByFunctions";
import { use } from "passport";
import { OrderTable } from "src/payment/entities/order.entity";

@Injectable()
export class RatingOrderService {
  constructor(
    @InjectRepository(RatingOrderTable)
    private readonly ratingOrderRepository: Repository<RatingOrderTable>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OrderTable)
    private readonly orderpository: Repository<OrderTable>,
  ) {}

  async createRatingOrder(
    orderId: string,
    createRatingOrderDto: CreateRatingOrderDto,
  ): Promise<RatingOrderTable> {
    const order = await this.orderpository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error("Order does not exist");
    }

    const newRatingOrder = this.ratingOrderRepository.create({
      ...createRatingOrderDto,
      orderId: order,
    });
    return await this.ratingOrderRepository.save(newRatingOrder);
  }

  async createRatingOrderWithAuth(
    userId: string,
    orderId: string,
    createRatingOrderDto: CreateRatingOrderDto,
  ): Promise<RatingOrderTable> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User does not exist");
    }

    const order = await this.orderpository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error("Order does not exist");
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

  // async getRatingOrderById(orderId: string): Promise<RatingOrderTable> {
  //     const ratingOrder = await this.ratingOrderRepository.findOne({ where: { id:orderId } });
  //     if (!ratingOrder) {
  //         throw new NotFoundException(`Rating order with ID ${orderId} not found`);
  //     }
  //     return ratingOrder;
  // }

  async getRatingOrderById(orderId: string): Promise<RatingOrderTable> {
    const ratingOrder = await this.ratingOrderRepository.findOne({
      where: { id: orderId },
      relations: [
        "userId",
        "orderId",
        "orderId.productId",
        "orderId.serviceId",
        "orderId.serviceId.digifranchiseId",
        "orderId.subProduct",
        "orderId.subService",
        "orderId.ownedDigifranchise",
      ],
    });
    if (!ratingOrder) {
      throw new NotFoundException(`Rating order with ID ${orderId} not found`);
    }
    return ratingOrder;
  }

  async getAllRatingsByOwnedDigifranchise(
    ownedDigifranchiseId: string,
  ): Promise<RatingOrderTable[]> {
    const ratings = await this.ratingOrderRepository
      .createQueryBuilder("rating")
      .innerJoinAndSelect("rating.orderId", "order")
      .leftJoinAndSelect("order.userId", "userId")
      .leftJoinAndSelect("order.productId", "productId")
      .leftJoinAndSelect("order.serviceId", "serviceId")
      .leftJoinAndSelect("serviceId.digifranchiseId", "digifranchiseId")
      .leftJoinAndSelect("order.subProduct", "subProduct")
      .leftJoinAndSelect("order.subService", "subService")
      .innerJoin("order.ownedDigifranchise", "ownedDigifranchise")
      .where("ownedDigifranchise.id = :ownedDigifranchiseId", {
        ownedDigifranchiseId,
      })
      .getMany();

    if (!ratings || ratings.length === 0) {
      throw new NotFoundException(
        `No ratings found for the ownedDigifranchise with ID ${ownedDigifranchiseId}`,
      );
    }

    return ratings;
  }

  async getAverageRatingForDigifranchise(
    digifranchiseId: string,
  ): Promise<number> {
    const result = await this.ratingOrderRepository
      .createQueryBuilder("rating")
      .select("AVG(rating.rating)", "averageRating")
      .innerJoin("rating.orderId", "order")
      .leftJoin("order.productId", "product")
      .leftJoin("order.serviceId", "service")
      .where(
        "product.digifranchiseId = :digifranchiseId OR service.digifranchiseId = :digifranchiseId",
        { digifranchiseId },
      )
      .getRawOne();

    return result ? result.averageRating : 0;
  }
}
