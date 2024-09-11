import { InjectRepository } from "@nestjs/typeorm";
import { DigifranchiseProduct } from "src/digifranchise/entities/digifranchise-product.entity";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { StatusEnum } from "src/statuses/statuses.enum";
import { Repository } from "typeorm";

export class DigifranchiseProductSeedService {
  constructor(
    @InjectRepository(Digifranchise)
    private digifranchiseRepository: Repository<Digifranchise>,
    @InjectRepository(DigifranchiseProduct)
    private productRepository: Repository<DigifranchiseProduct>,
  ) {}

  async run() {
    await this.seedBodyRevampProduct();
  }

  private async seedBodyRevampProduct() {
    const existingDigifranchise = await this.digifranchiseRepository.findOne({
      where: { digifranchiseName: "Body Revamp" },
    });

    let digifranchiseId;

    if (existingDigifranchise) {
      digifranchiseId = existingDigifranchise.id;
    } else {
      const newDigifranchise = this.digifranchiseRepository.create({
        digifranchiseName: "Body Revamp",
        description:
          "Body Revamp Product is a personal training digifranchiseId where certified individuals offer personalized personal training services to their customers. Customers can either subscribe to online exercise and training content or sign up for training sessions delivered live online or in-person.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(newDigifranchise);
      digifranchiseId = savedDigifranchise.id;
    }

    const bodyRevampProduct = [
      {
        productName: "Custom Exercise Plans",
        description: "Achieve your fitness goals with our Custom Exercise Plan tailored just for you. You get a personalized workout routine designed to fit your lifestyle and goals. Start your journey to a healthier, stronger you today.",
        unitPrice: "250",
      },
      {
        productName: "Exercise Channel Subscriptions",
        description: "Achieve your fitness goals with our Custom Exercise Plan tailored just for you. You get a personalized workout routine designed to fit your lifestyle and goals. Start your journey to a healthier, stronger you today.",
        unitPrice: "50",
      }, 
    ];

    for (const product of bodyRevampProduct) {
      const productEntity = this.productRepository.create({
        ...product,
        digifranchiseId: digifranchiseId,
      });
      await this.productRepository.save(productEntity);
    }
  }
}
