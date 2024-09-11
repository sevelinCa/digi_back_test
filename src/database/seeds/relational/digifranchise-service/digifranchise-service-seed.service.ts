import { InjectRepository } from "@nestjs/typeorm";
import { DigifranchiseServiceCategory } from "src/digifranchise/entities/digifranchise-service-category.entity";
import { DigifranchiseServiceOffered } from "src/digifranchise/entities/digifranchise-service-offered.entity";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { StatusEnum } from "src/statuses/statuses.enum";
import { Repository } from "typeorm";

export class DigifranchiseServiceSeedService {
  constructor(
    @InjectRepository(Digifranchise)
    private digifranchiseRepository: Repository<Digifranchise>,
    @InjectRepository(DigifranchiseServiceOffered)
    private serviceRepository: Repository<DigifranchiseServiceOffered>,
    @InjectRepository(DigifranchiseServiceCategory)
    private serviceCategoryRepository: Repository<DigifranchiseServiceCategory>
  ) {}

  async run() {
    await this.seedCleanWheelz();
    await this.seedBodyRevamp();
    await this.seedTrendifyMe();
    // await this.seedInsightfulJourney();
    await this.seedSitNStay();
    await this.seedTidyPatch();
    await this.seedStitched4U();
    await this.seedLearnerHub();
    await this.seedCollectify();
    // await this.seedBeautyAndBest();
    await this.seedCropMinder();
    await this.seedFrienderly();
  }

  private async seedCleanWheelz() {
    const check = await this.digifranchiseRepository.count({
      where: { digifranchiseName: "Clean Wheelz" },
    });

    if (check === 0) {
      const digifranchiseId = this.digifranchiseRepository.create({
        digifranchiseName: "Clean Wheelz",
        description:
          "Clean Wheelz offers mobile car wash services to customers. The digifranchise offers the convenience of a car wash that comes to wherever they are.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(digifranchiseId);

      const cleanWheelzServices = [
        {
          serviceName: "Express Exterior Wash",
          description: "Express Exterior Wash - Sedan, Small Bakkie, Hatchback",
          unitPrice: "",
          serviceCategory: [
            { serviceCategoryName: "Normal", unitPrice: "70", description: "" },
            { serviceCategoryName: "SUV", unitPrice: "80", description: "" },
            {
              serviceCategoryName: "Big Bakkie",
              unitPrice: "100",
              description: "",
            },
          ],
        },
        {
          serviceName: "Full Exterior Wash and Interior Detailing",
          description:
            "Full Exterior Wash and Interior Detailing - Sedan, Small Bakkie, Hatchback",
          unitPrice: "",
          serviceCategory: [
            {
              serviceCategoryName: "Normal",
              unitPrice: "200",
              description: "",
            },
            { serviceCategoryName: "SUV", unitPrice: "230", description: "" },
            {
              serviceCategoryName: "Big Bakkie",
              unitPrice: "250",
              description: "",
            },
          ],
        },
        {
          serviceName: "Basic Exterior and Interior Bundle",
          description:
            "Basic Exterior and Interior Bundle - Sedan, Small Bakkie, Hatchback",
          unitPrice: "",
          serviceCategory: [
            {
              serviceCategoryName: "Normal",
              unitPrice: "150",
              description: "",
            },
            { serviceCategoryName: "SUV", unitPrice: "170", description: "" },
            {
              serviceCategoryName: "Big Bakkie",
              unitPrice: "190",
              description: "",
            },
          ],
        },
      ];

      for (const service of cleanWheelzServices) {
        const serviceEntity = this.serviceRepository.create({
          ...service,
          digifranchiseId: savedDigifranchise,
        });
        await this.serviceRepository.save(serviceEntity);

        for (const category of service.serviceCategory) {
          const categoryEntity = this.serviceCategoryRepository.create({
            ...category,
            service: serviceEntity,
          });
          await this.serviceCategoryRepository.save(categoryEntity);
        }
      }
    }
  }

  private async seedBodyRevamp() {
    const check = await this.digifranchiseRepository.count({
      where: { digifranchiseName: "Body Revamp" },
    });

    if (check === 0) {
      const digifranchiseId = this.digifranchiseRepository.create({
        digifranchiseName: "Body Revamp",
        description:
          "Body Revamp is a personal training digifranchise where certified individuals offer personalized personal training services to their customers. Customers can either subscribe to online exercise and training content or sign up for training sessions delivered live online or in-person.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(digifranchiseId);

      const bodyRevampServices = [
        // {
        //   serviceName: "Live Training Sessions",
        //   description: "Live Training Sessions Description",
        //   unitPrice: "",
        //   serviceCategory: [
        //     {
        //       serviceCategoryName: "One Person",
        //       unitPrice: "100",
        //       description: "Description text here",
        //     },
        //     {
        //       serviceCategoryName: "Group",
        //       unitPrice: "50",
        //       description: "Description text here",
        //     },
        //   ],
        // },
        {
          serviceName: "Personal Training Sessions",
          description: "Personal Training Sessions Description",
          unitPrice: "",
          serviceCategory: [
            {
              serviceCategoryName: "Online",
              unitPrice: "100",
              description:
                "A Price of 100 for single person and 50 for each person for a group of people",
            },
            {
              serviceCategoryName: "In-Person",
              unitPrice: "200",
              description:
                "A Price of 200 for single person and 100 for each in group",
            },
          ],
        },
      ];

      for (const service of bodyRevampServices) {
        const serviceEntity = this.serviceRepository.create({
          ...service,
          digifranchiseId: savedDigifranchise,
        });
        await this.serviceRepository.save(serviceEntity);
        for (const category of service.serviceCategory) {
          const categoryEntity = this.serviceCategoryRepository.create({
            ...category,
            service: serviceEntity,
          });
          await this.serviceCategoryRepository.save(categoryEntity);
        }
      }
    }
  }

  private async seedTrendifyMe() {
    const check = await this.digifranchiseRepository.count({
      where: { digifranchiseName: "Trendify Me" },
    });

    if (check === 0) {
      const digifranchiseId = this.digifranchiseRepository.create({
        digifranchiseName: "Trendify Me",
        description:
          "Trendify Me connects individuals with Fashion Stylists to help them develop their own unique style, select clothing and accessories that suit their personality and body type, and create cohesive looks for various occasions.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(digifranchiseId);

      const trendifyMeServices = [
        {
          serviceName: "Fashion consultation",
          description:
            "Fashion consultation - R100 for the 1st hour, R50 per additional hour or part thereof",
          unitPrice: "100",
        },
        {
          serviceName: "Shopping guide - video call",
          description: "Shopping guide - video call. R50 per hour",
          unitPrice: "50",
        },
        {
          serviceName: "Shopping guide - in person",
          description:
            "Shopping guide - in person. R100 for the 1st hour, R50 per additional hour + R200 travel",
          unitPrice: "100",
        },
      ];

      for (const service of trendifyMeServices) {
        const serviceEntity = this.serviceRepository.create({
          ...service,
          digifranchiseId: savedDigifranchise,
        });
        await this.serviceRepository.save(serviceEntity);
      }
    }
  }

  // private async seedInsightfulJourney() {
  //     const check = await this.digifranchiseRepository.count({
  //         where: { digifranchiseName: "Insightful Journey" },
  //     });

  //     if (check === 0) {
  //         const digifranchiseId = this.digifranchiseRepository.create({
  //             digifranchiseName: "Insightful Journey",
  //             description: "Insightful Journey offers a range of mental health services, including counseling and therapy sessions designed to support individual and group needs.",
  //             status: StatusEnum.active,
  //         });

  //         const savedDigifranchise = await this.digifranchiseRepository.save(digifranchiseId);

  //         const insightfulJourneyServices = [
  //             {
  //                 serviceName: '1-on-1 Counselling',
  //                 description: '1-on-1 Counselling',
  //                 unitPrice: '150'
  //             },
  //             {
  //                 serviceName: 'Play Therapy for Kids',
  //                 description: 'Play Therapy for Kids',
  //                 unitPrice: '120'
  //             },
  //             {
  //                 serviceName: 'Group Counselling',
  //                 description: 'Group Counselling',
  //                 unitPrice: '90'
  //             },
  //             {
  //                 serviceName: 'Meditation Sessions',
  //                 description: 'Meditation Sessions',
  //                 unitPrice: '80'
  //             },
  //             {
  //                 serviceName: 'Mental Health Assessments',
  //                 description: 'Mental Health Assessments',
  //                 unitPrice: '200'
  //             },
  //         ];

  //         for (const service of insightfulJourneyServices) {
  //             const serviceEntity = this.serviceRepository.create({
  //                 ...service,
  //                 digifranchiseId: savedDigifranchise,
  //             });
  //             await this.serviceRepository.save(serviceEntity);
  //         }
  //     }
  // }

  private async seedSitNStay() {
    const check = await this.digifranchiseRepository.count({
      where: { digifranchiseName: "Sit N Stay" },
    });

    if (check === 0) {
      const digifranchiseId = this.digifranchiseRepository.create({
        digifranchiseName: "Sit N Stay",
        description:
          "Sit N Stay provides pet sitting and house sitting services to ensure your pets and homes are taken care of while you're away.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(digifranchiseId);

      const sitNStayServices = [
        {
          serviceName: "House sitting (without pets)",
          description: "House sitting (without pets)",
          unitPrice: "250",
        },
        {
          serviceName: "House sitting (with pets)",
          description: "House sitting (with pets)",
          unitPrice: "300",
        },
        {
          serviceName: "Pet sitting",
          description: "Pet sitting",
          unitPrice: "150",
        },
      ];

      for (const service of sitNStayServices) {
        const serviceEntity = this.serviceRepository.create({
          ...service,
          digifranchiseId: savedDigifranchise,
        });
        await this.serviceRepository.save(serviceEntity);
      }
    }
  }

  private async seedTidyPatch() {
    const check = await this.digifranchiseRepository.count({
      where: { digifranchiseName: "Tidy Patch" },
    });

    if (check === 0) {
      const digifranchiseId = this.digifranchiseRepository.create({
        digifranchiseName: "Tidy Patch",
        description:
          "Tidy Patch offers cleaning services for both indoor and outdoor environments.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(digifranchiseId);

      const tidyPatchServices = [
        {
          serviceName: "Indoor regular cleaning",
          description: "Indoor regular cleaning",
          unitPrice: "100",
        },
        {
          serviceName: "Indoor deep cleaning",
          description: "Indoor deep cleaning",
          unitPrice: "250",
        },
        {
          serviceName: "Outdoor cleaning",
          description: "Outdoor cleaning",
          unitPrice: "150",
        },
      ];

      for (const service of tidyPatchServices) {
        const serviceEntity = this.serviceRepository.create({
          ...service,
          digifranchiseId: savedDigifranchise,
        });
        await this.serviceRepository.save(serviceEntity);
      }
    }
  }

  private async seedStitched4U() {
    const check = await this.digifranchiseRepository.count({
      where: { digifranchiseName: "Stitched 4 U" },
    });

    if (check === 0) {
      const digifranchiseId = this.digifranchiseRepository.create({
        digifranchiseName: "Stitched 4 U",
        description:
          "Stitched 4 U offers a range of clothing alteration and repair services.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(digifranchiseId);

      const stitched4UServices = [
        {
          serviceName: "Zip repair and replacement",
          description: "Zip repair and replacement - Description",
          unitPrice: "",
          serviceCategory: [
            {
              serviceCategoryName: "Trousers and skirts",
              unitPrice: "100",
              description: "Description text here",
            },
            {
              serviceCategoryName: "Jeans, dresses and short jackets",
              unitPrice: "110",
              description: "Description text here",
            },
            {
              serviceCategoryName: "Long jackets and cushions",
              unitPrice: "120",
              description: "Description text here",
            },
          ],
        },
        {
          serviceName: "Basic Alterations",
          description: "Alterations - Description",
          unitPrice: "",
          serviceCategory: [
            {
              serviceCategoryName: "Lengthening and shortening",
              unitPrice: "110",
              description: "Description text here",
            },
            {
              serviceCategoryName: "Resize Up or Down",
              unitPrice: "120",
              description: "Description text here",
            },
            {
              serviceCategoryName: "Non-clothing alterations",
              unitPrice: "130",
              description: "Description text here",
            },
          ],
        },
        {
          serviceName: "Clothing Repair",
          description: "Clothing Repair description",
          unitPrice: "",

          serviceCategory: [
            {
              serviceCategoryName: "Patching",
              unitPrice: "65",
              description: "Patchting Description text here",
            },
            {
              serviceCategoryName: "Button replacement",
              unitPrice: "50",
              description: "Button replacement Description here",
            },
          ],
        },
      ];

      for (const service of stitched4UServices) {
        const serviceEntity = this.serviceRepository.create({
          ...service,
          digifranchiseId: savedDigifranchise,
        });
        await this.serviceRepository.save(serviceEntity);
        for (const category of service.serviceCategory) {
          const categoryEntity = this.serviceCategoryRepository.create({
            ...category,
            service: serviceEntity,
          });
          await this.serviceCategoryRepository.save(categoryEntity);
        }
      }
    }
  }

  private async seedLearnerHub() {
    const check = await this.digifranchiseRepository.count({
      where: { digifranchiseName: "Learner Hub" },
    });

    if (check === 0) {
      const digifranchiseId = this.digifranchiseRepository.create({
        digifranchiseName: "Learner Hub",
        description:
          "Learner Hub provides online and in-person tutoring sessions.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(digifranchiseId);

      const learnerHubServices = [
        {
          serviceName: "Online tutoring sessions",
          description: "Online tutoring sessions",
          unitPrice: "100",
        },
        {
          serviceName: "In person tutoring sessions",
          description: "In person tutoring sessions",
          unitPrice: "150",
        },
      ];

      for (const service of learnerHubServices) {
        const serviceEntity = this.serviceRepository.create({
          ...service,
          digifranchiseId: savedDigifranchise,
        });
        await this.serviceRepository.save(serviceEntity);
      }
    }
  }

  private async seedCollectify() {
    const check = await this.digifranchiseRepository.count({
      where: { digifranchiseName: "Collectify" },
    });

    if (check === 0) {
      const digifranchiseId = this.digifranchiseRepository.create({
        digifranchiseName: "Collectify",
        description:
          "Collectify offers survey design, execution, and data collection services.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(digifranchiseId);

      const collectifyServices = [
        {
          serviceName: "Survey design and questionnaire development",
          description: "Survey design and questionnaire development",
          unitPrice: "190",
          serviceCategory: []
        },
        {
          serviceName: "Survey execution",
          description: "Survey execution description",
          unitPrice: "",
          serviceCategory: [
            {
              serviceCategoryName: "Digital",
              description: "Max 20 questions and 20 respondents",
              unitPrice: "100",
            },
            {
              serviceCategoryName: "In-Person",
              description: "Max 20 questions and 10 respondents",
              unitPrice: "500",
            },
          ],
        },

        {
          serviceName: "In-Field Data Collection",
          description: "In Field Data Collection",
          unitPrice: "200",
          serviceCategory: []
        },
        {
          serviceName: "Data Cleaning and Capturing",
          description: "Data Cleaning and Capturing",
          unitPrice: "70",
          serviceCategory: []
        },
      ];

      for (const service of collectifyServices) {
        const serviceEntity = this.serviceRepository.create({
          ...service,
          digifranchiseId: savedDigifranchise,
        });
        await this.serviceRepository.save(serviceEntity);
        for (const category of service.serviceCategory) {
          const categoryEntity = this.serviceCategoryRepository.create({
            ...category,
            service: serviceEntity,
          });
          await this.serviceCategoryRepository.save(categoryEntity);
        }
      }
    }
  }

  // private async seedBeautyAndBest() {
  //     const check = await this.digifranchiseRepository.count({
  //         where: { digifranchiseName: "Beauty And Best" },
  //     });

  //     if (check ===  0) {
  //         const digifranchiseId = this.digifranchiseRepository.create({
  //             digifranchiseName: "Beauty And Best",
  //             description: "Beauty And Best provides beauty and grooming services.",
  //             status: StatusEnum.active,
  //         });

  //         const savedDigifranchise = await this.digifranchiseRepository.save(digifranchiseId);

  //         const beautyAndBestServices = [
  //             {
  //                 serviceName: 'Hairstyling',
  //                 description: 'Hairstyling',
  //                 unitPrice: '15'
  //             },
  //             {
  //                 serviceName: 'Nail care',
  //                 description: 'Nail care',
  //                 unitPrice: '15'
  //             },
  //             {
  //                 serviceName: 'Make-up application',
  //                 description: 'Make-up application',
  //                 unitPrice: '15'
  //             },
  //             {
  //                 serviceName: 'Hair cuts',
  //                 description: 'Hair cuts',
  //                 unitPrice: '15'
  //             },
  //         ];

  //         for (const service of beautyAndBestServices) {
  //             const serviceEntity = this.serviceRepository.create({
  //                 ...service,
  //                 digifranchiseId: savedDigifranchise,
  //             });
  //             await this.serviceRepository.save(serviceEntity);
  //         }
  //     }
  // }

  private async seedCropMinder() {
    const check = await this.digifranchiseRepository.count({
      where: { digifranchiseName: "Crop Minder" },
    });

    if (check === 0) {
      const digifranchiseId = this.digifranchiseRepository.create({
        digifranchiseName: "Crop Minder",
        description:
          "Crop Minder offers agricultural services for crop management.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(digifranchiseId);

      const cropMinderServices = [
        {
          serviceName: "Online Consultation",
          description: "via video or phone call",
          unitPrice: "120",
        },
        {
          serviceName: "In-person Consultation",
          description: "Physically",
          unitPrice: "200",
        },
      ];

      for (const service of cropMinderServices) {
        const serviceEntity = this.serviceRepository.create({
          ...service,
          digifranchiseId: savedDigifranchise,
        });
        await this.serviceRepository.save(serviceEntity);
      }
    }
  }

  private async seedFrienderly() {
    const check = await this.digifranchiseRepository.count({
      where: { digifranchiseName: "Frienderly" },
    });

    if (check === 0) {
      const digifranchiseId = this.digifranchiseRepository.create({
        digifranchiseName: "Frienderly",
        description:
          "This digifranchise offers companion care to the elderly. The services are offered within specific areas. Customers can request a free 30-min introductory conversation.",
        status: StatusEnum.active,
      });

      const savedDigifranchise =
        await this.digifranchiseRepository.save(digifranchiseId);

      const frienderlyServices = [
        {
          serviceName: "Games for Seniors",
          description:
            "Games for Seniors - R150 per hour per companion. Group size 5 - 20.",
          unitPrice: "150",
        },
        {
          serviceName: "Individual Companion Care",
          description:
            "Individual Companion Care - R175 per hour. Up to 2 elderly people. Activities - reading, conversation, in-home games, painting, scribing.",
          unitPrice: "175",
        },
      ];

      for (const service of frienderlyServices) {
        const serviceEntity = this.serviceRepository.create({
          ...service,
          digifranchiseId: savedDigifranchise,
        });
        await this.serviceRepository.save(serviceEntity);
      }
    }
  }
}
