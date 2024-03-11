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
        await this.seedGymMaterial();
        await this.seedSalonMaterial();
    }

    private async seedGymMaterial() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "GYM Material" },
        });

        if (check === 0) {
            const newDigifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "GYM Material",
                description: "GYM Material is a personal training digifranchiseId where certified individuals offer personalized personal training services to their customers. Customers can either subscribe to online exercise and training content or sign up for training sessions delivered live online or in-person.",
                status: StatusEnum.active,
            });

            const savedDigifranchise = await this.digifranchiseRepository.save(newDigifranchise);

            const GymMaterialServices = [
                {
                    productName: 'Live Training Sessions 1-on-1',
                    description: 'Live Training Sessions',
                    unitPrice: '100',
                },
                {
                    productName: 'Live Training Sessions 1-on-1',
                    description: 'Live Training Sessions',
                    unitPrice: '100'
                },
                {
                    productName: 'Live Training Sessions Group (2-5)',
                    description: 'Live Training Sessions',
                    unitPrice: '50'
                },
                {
                    productName: 'Personal Training Sessions 1-on-1',
                    description: 'Personal Training Sessions',
                    unitPrice: '200'
                },
            ];

            for (const service of GymMaterialServices) {
                const serviceEntity = this.productRepository.create({
                    ...service,
                    digifranchiseId: savedDigifranchise, 
                });
                await this.productRepository.save(serviceEntity);
            }
        }
    }

    private async seedSalonMaterial() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Salon Material" },
        });

        if (check === 0) {
            const newDigifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Salon Material",
                description: "Salon Material offers a range of mental health services, including counseling and therapy sessions designed to support individual and group needs.",
                status: StatusEnum.active,
            });

            const savedDigifranchise = await this.digifranchiseRepository.save(newDigifranchise);

            const SalonMaterialServices = [
                {
                    productName: '1-on-1 Counselling',
                    description: '1-on-1 Counselling',
                    unitPrice: '150'
                },
                {
                    productName: 'Play Therapy for Kids',
                    description: 'Play Therapy for Kids',
                    unitPrice: '120'
                },
                {
                    productName: 'Custom Exercise Plans',
                    description: 'Custom Exercise Plans',
                    unitPrice: '250'
                },
            ];

            for (const service of SalonMaterialServices) {
                const serviceEntity = this.productRepository.create({
                    ...service,
                    digifranchiseId: savedDigifranchise, 
                });
                await this.productRepository.save(serviceEntity);
            }
        }
    }
}