
import { InjectRepository } from "@nestjs/typeorm";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { DigifranchiseService } from "src/digifranchise/entities/digifranchise-service.entity"; 
import { StatusEnum } from "src/statuses/statuses.enum";
import { Repository } from "typeorm";

export class DigifranchiseSeedService {
    constructor(
        @InjectRepository(Digifranchise)
        private digifranchiseRepository: Repository<Digifranchise>,
        @InjectRepository(DigifranchiseService)
        private serviceRepository: Repository<DigifranchiseService>, 
    ) { }

    async run() {
        const checkBodyRevamp = await this.digifranchiseRepository.count({
            where: {
                digifranchiseName: "Body Revamp",
            },
        });

        if (checkBodyRevamp === 0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Body Revamp",
                description: "Body Revamp is a personal training digifranchise where certified individuals offer personalized personal training services to their customers. Customers can either subscribe to online exercise and training content or sign up for training sessions delivered live online or in-person.",
                status: StatusEnum.active,
            });

            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);

            const services = [
                {
                    serviceName: 'Live Training Sessions 1-on-1',
                    description: 'Live Training Sessions',
                    unitPrice: '100',
                },
                {
                    serviceName: 'Live Training Sessions 1-on-1',
                    description: 'Live Training Sessions',
                    unitPrice: '100'
                },
                {
                    serviceName: 'Live Training Sessions Group (2-5)',
                    description: 'Live Training Sessions',
                    unitPrice: '50'
                },
                {
                    serviceName: 'Personal Training Sessions 1-on-1',
                    description: 'Personal Training Sessions',
                    unitPrice: '200'
                },
                {
                    serviceName: 'Personal Training Sessions Group (2-5)',
                    description: 'Personal Training Sessions',
                    unitPrice: '100'
                },
                {
                    serviceName: 'Custom Exercise Plans',
                    description: 'Custom Exercise Plans',
                    unitPrice: '250'
                },
                {
                    serviceName: 'Exercise Channel Subscription - 30 days',
                    description: 'Exercise Channel Subscription - 30 days',
                    unitPrice: '50'
                },

            ];

            for (const service of services) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise, 
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }
}
