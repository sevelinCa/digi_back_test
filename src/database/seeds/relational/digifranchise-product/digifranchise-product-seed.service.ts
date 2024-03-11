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
    ) { }

    async run() {
        await this.seedBodyRevampProduct();
    }

    private async seedBodyRevampProduct() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Body Revamp Product" },
        });

        if (check === 0) {
            const newDigifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Body Revamp Product",
                description: "Body Revamp Product is a personal training digifranchiseId where certified individuals offer personalized personal training services to their customers. Customers can either subscribe to online exercise and training content or sign up for training sessions delivered live online or in-person.",
                status: StatusEnum.active,
            });

            const savedDigifranchise = await this.digifranchiseRepository.save(newDigifranchise);

            const bodyRevampProduct = [
                {
                    productName: 'Custom Exercise Plans',
                    description: 'Custom Exercise Plans',
                    unitPrice: '250'
                }
            ];

            for (const service of bodyRevampProduct) {
                const serviceEntity = this.productRepository.create({
                    ...service,
                    digifranchiseId: savedDigifranchise, 
                });
                await this.productRepository.save(serviceEntity);
            }
        }
    }

}