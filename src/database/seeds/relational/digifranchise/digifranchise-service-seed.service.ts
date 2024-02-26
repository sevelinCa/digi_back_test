
import { InjectRepository } from "@nestjs/typeorm";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { DigifranchiseServiceTable } from "src/digifranchise/entities/digifranchise-service.entity";
import { StatusEnum } from "src/statuses/statuses.enum";
import { Repository } from "typeorm";

export class DigifranchiseSeedService {
    constructor(
        @InjectRepository(Digifranchise)
        private digifranchiseRepository: Repository<Digifranchise>,
        @InjectRepository(DigifranchiseServiceTable)
        private serviceRepository: Repository<DigifranchiseServiceTable>,
    ) { }

    async run() {
        await this.seedBodyRevamp();
        await this.seedInsightfulJourney();
        await this.seedSitNStay();
        await this.seedTidyPatch();
        await this.seedFlair();
        await this.seedStitched4U();
        await this.seedLearnerHub();
        await this.seedCollectify();
        await this.seedBeautyAndBest();
        await this.seedCropMinder();
        await this.seedAquaShine(); 
    }

    private async seedBodyRevamp() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Body Revamp" },
        });

        if (check === 0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Body Revamp",
                description: "Body Revamp is a personal training digifranchise where certified individuals offer personalized personal training services to their customers. Customers can either subscribe to online exercise and training content or sign up for training sessions delivered live online or in-person.",
                status: StatusEnum.active,
            });

            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);

            const bodyRevampServices = [
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

            for (const service of bodyRevampServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }

    private async seedInsightfulJourney() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Insightful Journey" },
        });

        if (check === 0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Insightful Journey",
                description: "Insightful Journey offers a range of mental health services, including counseling and therapy sessions designed to support individual and group needs.",
                status: StatusEnum.active,
            });

            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);

            const insightfulJourneyServices = [
                {
                    serviceName: '1-on-1 Counselling',
                    description: '1-on-1 Counselling',
                    unitPrice: '150'
                },
                {
                    serviceName: 'Play Therapy for Kids',
                    description: 'Play Therapy for Kids',
                    unitPrice: '120'
                },
                {
                    serviceName: 'Group Counselling',
                    description: 'Group Counselling',
                    unitPrice: '90'
                },
                {
                    serviceName: 'Meditation Sessions',
                    description: 'Meditation Sessions',
                    unitPrice: '80'
                },
                {
                    serviceName: 'Mental Health Assessments',
                    description: 'Mental Health Assessments',
                    unitPrice: '200'
                },
            ];

            for (const service of insightfulJourneyServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }

    private async seedSitNStay() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Sit N Stay" },
        });
    
        if (check ===  0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Sit N Stay",
                description: "Sit N Stay provides pet sitting and house sitting services to ensure your pets and homes are taken care of while you're away.",
                status: StatusEnum.active,
            });
    
            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);
    
            const sitNStayServices = [
                {
                    serviceName: 'House sitting (without pets)',
                    description: 'House sitting (without pets)',
                    unitPrice: '250'
                },
                {
                    serviceName: 'House sitting (with pets)',
                    description: 'House sitting (with pets)',
                    unitPrice: '300'
                },
                {
                    serviceName: 'Pet sitting',
                    description: 'Pet sitting',
                    unitPrice: '50'
                },
                {
                    serviceName: 'Dog walking',
                    description: 'Dog walking',
                    unitPrice: '50'
                },
            ];
    
            for (const service of sitNStayServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }

    private async seedTidyPatch() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Tidy Patch" },
        });
    
        if (check ===  0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Tidy Patch",
                description: "Tidy Patch offers cleaning services for both indoor and outdoor environments.",
                status: StatusEnum.active,
            });
    
            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);
    
            const tidyPatchServices = [
                {
                    serviceName: 'Indoor regular cleaning',
                    description: 'Indoor regular cleaning',
                    unitPrice: '100'
                },
                {
                    serviceName: 'Indoor deep cleaning',
                    description: 'Indoor deep cleaning',
                    unitPrice: '250'
                },
                {
                    serviceName: 'Outdoor cleaning',
                    description: 'Outdoor cleaning',
                    unitPrice: '150'
                },
            ];
    
            for (const service of tidyPatchServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }
    
    private async seedFlair() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Flair" },
        });
    
        if (check ===  0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Flair",
                description: "Flair provides fashion consultation and shopping guide services.",
                status: StatusEnum.active,
            });
    
            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);
    
            const flairServices = [
                {
                    serviceName: 'Fashion consultation',
                    description: 'Fashion consultation',
                    unitPrice: '100'
                },
                {
                    serviceName: 'Shopping guide - video call',
                    description: 'Shopping guide - video call',
                    unitPrice: '50'
                },
                {
                    serviceName: 'Shopping guide - in person',
                    description: 'Shopping guide - in person',
                    unitPrice: '100'
                },
            ];
    
            for (const service of flairServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }

    private async seedStitched4U() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Stitched  4 U" },
        });
    
        if (check ===   0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Stitched  4 U",
                description: "Stitched  4 U offers a range of clothing alteration and repair services.",
                status: StatusEnum.active,
            });
    
            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);
    
            const stitched4UServices = [
                {
                    serviceName: 'Zip repair and replacement - Trousers and skirts',
                    description: 'Zip repair and replacement - Trousers and skirts',
                    unitPrice: '100'
                },
                {
                    serviceName: 'Zip repair and replacement - Jeans, dresses and short jackets',
                    description: 'Zip repair and replacement - Jeans, dresses and short jackets',
                    unitPrice: '110'
                },
                {
                    serviceName: 'Zip repair and replacement - Long jackets and cushions',
                    description: 'Zip repair and replacement - Long jackets and cushions',
                    unitPrice: '120'
                },
                {
                    serviceName: 'Alterations - Lengthening and shortening',
                    description: 'Alterations - Lengthening and shortening',
                    unitPrice: '110'
                },
                {
                    serviceName: 'Alterations - Resize up or down',
                    description: 'Alterations - Resize up or down',
                    unitPrice: '120'
                },
                {
                    serviceName: 'Non-clothing alterations',
                    description: 'Non-clothing alterations',
                    unitPrice: '120'
                },
                {
                    serviceName: 'Patching',
                    description: 'Patching',
                    unitPrice: '65'
                },
                {
                    serviceName: 'Button replacement',
                    description: 'Button replacement',
                    unitPrice: '20'
                },
            ];
    
            for (const service of stitched4UServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }
    
    private async seedLearnerHub() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Learner Hub" },
        });
    
        if (check ===   0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Learner Hub",
                description: "Learner Hub provides online and in-person tutoring sessions.",
                status: StatusEnum.active,
            });
    
            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);
    
            const learnerHubServices = [
                {
                    serviceName: 'Online tutoring sessions',
                    description: 'Online tutoring sessions',
                    unitPrice: '100'
                },
                {
                    serviceName: 'In person tutoring sessions',
                    description: 'In person tutoring sessions',
                    unitPrice: '150'
                },
            ];
    
            for (const service of learnerHubServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }

    private async seedCollectify() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Collectify" },
        });
    
        if (check ===  0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Collectify",
                description: "Collectify offers survey design, execution, and data collection services.",
                status: StatusEnum.active,
            });
    
            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);
    
            const collectifyServices = [
                {
                    serviceName: 'Survey design and questionnaire development',
                    description: 'Survey design and questionnaire development',
                    unitPrice: '190'
                },
                {
                    serviceName: 'Survey execution - digitally',
                    description: 'Survey execution - digitally',
                    unitPrice: '5'
                },
                {
                    serviceName: 'Survey execution - in-person',
                    description: 'Survey execution - in-person',
                    unitPrice: '50'
                },
                {
                    serviceName: 'In Field Data Collection',
                    description: 'In Field Data Collection',
                    unitPrice: '200'
                },
                {
                    serviceName: 'Data Cleaning and Capturing',
                    description: 'Data Cleaning and Capturing',
                    unitPrice: '70'
                },
            ];
    
            for (const service of collectifyServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }
    
    private async seedBeautyAndBest() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Beauty And Best" },
        });
    
        if (check ===  0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Beauty And Best",
                description: "Beauty And Best provides beauty and grooming services.",
                status: StatusEnum.active,
            });
    
            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);
    
            const beautyAndBestServices = [
                {
                    serviceName: 'Hairstyling',
                    description: 'Hairstyling',
                    unitPrice: '15'
                },
                {
                    serviceName: 'Nail care',
                    description: 'Nail care',
                    unitPrice: '15'
                },
                {
                    serviceName: 'Make-up application',
                    description: 'Make-up application',
                    unitPrice: '15'
                },
                {
                    serviceName: 'Hair cuts',
                    description: 'Hair cuts',
                    unitPrice: '15'
                },
            ];
    
            for (const service of beautyAndBestServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }
    
    private async seedCropMinder() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Crop Minder" },
        });
    
        if (check ===  0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Crop Minder",
                description: "Crop Minder offers agricultural services for crop management.",
                status: StatusEnum.active,
            });
    
            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);
    
            const cropMinderServices = [
                {
                    serviceName: 'Site assessment and planning',
                    description: 'Site assessment and planning',
                    unitPrice: '120'
                },
                {
                    serviceName: 'Crop selection and rotation',
                    description: 'Crop selection and rotation',
                    unitPrice: '120'
                },
                {
                    serviceName: 'Soil health management',
                    description: 'Soil health management',
                    unitPrice: '120'
                },
                {
                    serviceName: 'Harvesting and post-harvest handling',
                    description: 'Harvesting and post-harvest handling',
                    unitPrice: '120'
                },
                {
                    serviceName: 'Pest and disease management',
                    description: 'Pest and disease management',
                    unitPrice: '120'
                },
                {
                    serviceName: 'Water management',
                    description: 'Water management',
                    unitPrice: '120'
                },
                {
                    serviceName: 'Crop care and maintenance',
                    description: 'Crop care and maintenance',
                    unitPrice: '120'
                },
            ];
    
            for (const service of cropMinderServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }

    private async seedAquaShine() {
        const check = await this.digifranchiseRepository.count({
            where: { digifranchiseName: "Aqua Shine" },
        });
    
        if (check ===   0) {
            const digifranchise = this.digifranchiseRepository.create({
                digifranchiseName: "Aqua Shine",
                description: "Aqua Shine offers car washing and detailing services.",
                status: StatusEnum.active,
            });
    
            const savedDigifranchise = await this.digifranchiseRepository.save(digifranchise);
    
            const aquaShineServices = [
                {
                    serviceName: 'Express Exterior Wash - Sedan, Small Bakkie, Hatchback',
                    description: 'Express Exterior Wash - Sedan, Small Bakkie, Hatchback',
                    unitPrice: '70'
                },
                {
                    serviceName: 'Express Exterior Wash - SUV',
                    description: 'Express Exterior Wash - SUV',
                    unitPrice: '80'
                },
                {
                    serviceName: 'Express Exterior Wash - Big Bakkie',
                    description: 'Express Exterior Wash - Big Bakkie',
                    unitPrice: '100'
                },
                {
                    serviceName: 'Full Exterior Wash and Interior Detailing - Sedan, Small Bakkie, Hatchback',
                    description: 'Full Exterior Wash and Interior Detailing - Sedan, Small Bakkie, Hatchback',
                    unitPrice: '200'
                },
                {
                    serviceName: 'Full Exterior Wash and Interior Detailing - SUV',
                    description: 'Full Exterior Wash and Interior Detailing - SUV',
                    unitPrice: '230'
                },
                {
                    serviceName: 'Full Exterior Wash and Interior Detailing - Big Bakkie',
                    description: 'Full Exterior Wash and Interior Detailing - Big Bakkie',
                    unitPrice: '250'
                },
                {
                    serviceName: 'Basic Exterior and Interior Bundle - Sedan, Small Bakkie, Hatchback',
                    description: 'Basic Exterior and Interior Bundle - Sedan, Small Bakkie, Hatchback',
                    unitPrice: '150'
                },
                {
                    serviceName: 'Basic Exterior and Interior Bundle - SUV',
                    description: 'Basic Exterior and Interior Bundle - SUV',
                    unitPrice: '170'
                },
                {
                    serviceName: 'Basic Exterior and Interior Bundle - Big Bakkie',
                    description: 'Basic Exterior and Interior Bundle - Big Bakkie',
                    unitPrice: '190'
                },
            ];
    
            for (const service of aquaShineServices) {
                const serviceEntity = this.serviceRepository.create({
                    ...service,
                    digifranchise: savedDigifranchise,
                });
                await this.serviceRepository.save(serviceEntity);
            }
        }
    }
}
