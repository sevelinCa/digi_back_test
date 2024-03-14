import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { checkIfUserExists } from "src/helper/FindByFunctions";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Repository, IsNull, Equal } from "typeorm";
import { CustomerSubscription } from "./entities/customer-subscription.entity";

@Injectable()
export class CustomerSubscriptionService {
   constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      @InjectRepository(Digifranchise)
      private readonly digifranchiseRepository: Repository<Digifranchise>,
      @InjectRepository(CustomerSubscription)
      private readonly customerSubscriptionRepository: Repository<CustomerSubscription>,
   ) { }

async createSubscription(userId: string, digifranchiseId: string): Promise<CustomerSubscription> {
    const user = await checkIfUserExists(this.userRepository, userId);
    if (!user) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    const digifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } })
    if (!digifranchise) {
        throw new HttpException('Digifranchise not exist', HttpStatus.NOT_FOUND);
    }

    const existingSubscription = await this.customerSubscriptionRepository.findOne({
        where: { userId: Equal(user.id), digifranchiseId: Equal(digifranchise.id) }
    });
    if (existingSubscription) {
        throw new HttpException('User is already subscribed to this digifranchise', HttpStatus.CONFLICT);
    }

    const newSubscription = this.customerSubscriptionRepository.create({
        userId: user,
        digifranchiseId: digifranchise
    });
    const savedSubscription = await this.customerSubscriptionRepository.save(newSubscription);
    return savedSubscription;
}


   async getAllSubscriptions(userId: string): Promise<CustomerSubscription[]> {
      return this.customerSubscriptionRepository.find({ where: { userId: Equal(userId), deleteAt: IsNull() } });
   }

   async getOneSubscription(id: string): Promise<CustomerSubscription | null> {
      return this.customerSubscriptionRepository.findOne({ where: { deleteAt: IsNull() } });
   }

   async deleteSubscription(id: string): Promise<void> {
      await this.customerSubscriptionRepository.delete(id);
   }

   async getSubscribersByDigifranchiseId(digifranchiseId: string): Promise<CustomerSubscription[]> {
      return this.customerSubscriptionRepository.find({
          where: { digifranchiseId: Equal(digifranchiseId), deleteAt: IsNull() },
      });
  }
}