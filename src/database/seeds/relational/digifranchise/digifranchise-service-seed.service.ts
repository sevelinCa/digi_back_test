import { InjectRepository } from "@nestjs/typeorm";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { RoleEnum } from "src/roles/roles.enum";
import { StatusEnum } from "src/statuses/statuses.enum";
import type { Repository } from "typeorm";


export class DigifranchiseSeedService {

    constructor(
        @InjectRepository(Digifranchise)
        private repository: Repository<Digifranchise>,
    ) { }

    async run() {
        const checkBodyRevamp = await this.repository.count({
            where: {
                digifranchiseName: "Body Revamp",
            },
        });

        if (!checkBodyRevamp) {
            await this.repository.save(
                this.repository.create({
                    digifranchiseName: "Body Revamp",
                    description: "Body Revamp is a personal training digifranchise where certified individuals offer personalized personal training services to their customers. Customers can either subscribe to online exercise and training content or sign up for training sessions delivered live online or in-person.",
                    status: StatusEnum.active,
                    services: [
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

                    ]
                }),
            );
        }

    }
}