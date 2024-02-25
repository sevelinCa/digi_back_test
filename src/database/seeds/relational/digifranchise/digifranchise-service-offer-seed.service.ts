// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
// import { DigifranchiseServiceOffer } from 'src/digifranchise/entities/digifranchise-service.entity';

// @Injectable()
// export class DigifranchiseServiceOfferSeedService {
//   constructor(
//     @InjectRepository(DigifranchiseServiceOffer)
//     private readonly serviceOfferRepository: Repository<DigifranchiseServiceOffer>,
//   ) {}

//   async run() {
// const bodyRevampServices = [
//     { description: 'Live Training Sessions - 1-on-1', unitPrice: '100' },
//     { description: 'Live Training Sessions - Group (2-5)', unitPrice: '50' },
//     { description: 'Personal Training Sessions - 1-on-1', unitPrice: '200' },
//     { description: 'Personal Training Sessions - Group (2-5)', unitPrice: '100' },
//     { description: 'Custom Exercise Plans', unitPrice: '250' },
//     { description: 'Exercise Channel Subscription - 30 days', unitPrice: '50' },
//   ]; 

// const insightfulJourneyServices = [
//     { description: '1-on-1 Counselling', unitPrice: '150' },
//     { description: 'Play Therapy for Kids', unitPrice: '120' },
//     { description: 'Group Counselling', unitPrice: '90' },
//     { description: 'Meditation Sessions', unitPrice: '80' },
//     { description: 'Mental Health Assessments', unitPrice: '200' },
//   ];
  
//   const sitNStayServices = [
//     { description: 'House sitting (without pets)', unitPrice: '250' },
//     { description: 'House sitting (with pets)', unitPrice: '300' },
//     { description: 'Pet sitting', unitPrice: '50' },
//     { description: 'Dog walking', unitPrice: '50' },
//   ];
  
//   const tidyPatchServices = [
//     { description: 'Indoor regular cleaning', unitPrice: '100' },
//     { description: 'Indoor deep cleaning', unitPrice: '250' },
//     { description: 'Outdoor cleaning', unitPrice: '150' },
//   ];
  
//   const flairServices = [
//     { description: 'Fashion consultation', unitPrice: '100' },
//     { description: 'Shopping guide - video call', unitPrice: '50' },
//     { description: 'Shopping guide - in person', unitPrice: '100' }, 
//   ];
  
//   const stitched4UServices = [
//     { description: 'Zip repair and replacement - Trousers and skirts', unitPrice: '100' },
//     { description: 'Zip repair and replacement - Jeans, dresses and short jackets', unitPrice: '110' },
//     { description: 'Zip repair and replacement - Long jackets and cushions', unitPrice: '120' },
//     { description: 'Alterations - Lengthening and shortening', unitPrice: '110' },
//     { description: 'Alterations - Resize up or down', unitPrice: '120' },
//     { description: 'Non-clothing alterations', unitPrice: '120' },
//     { description: 'Patching', unitPrice: '65' },
//     { description: 'Button replacement', unitPrice: '20' },
//   ];
  
//   const learnerHubServices = [
//     { description: 'Online tutoring sessions', unitPrice: '100' },
//     { description: 'In person tutoring sessions', unitPrice: '150' }, 
//   ];
  
//   const collectifyServices = [
//     { description: 'Survey design and questionnaire development', unitPrice: '190' },
//     { description: 'Survey execution - digitally', unitPrice: '5' },
//     { description: 'Survey execution - in-person', unitPrice: '50' },
//     { description: 'In Field Data Collection', unitPrice: '200' },
//     { description: 'Data Cleaning and Capturing', unitPrice: '70' },
//   ];
  
//   const beautyAndBestServices = [
//     { description: 'Hairstyling', unitPrice: '15' },
//     { description: 'Nail care', unitPrice: '15' },
//     { description: 'Make-up application', unitPrice: '15' },
//     { description: 'Hair cuts', unitPrice: '15' },
//   ];
  
//   const cropMinderServices = [
//     { description: 'Site assessment and planning', unitPrice: '120' },
//     { description: 'Crop selection and rotation', unitPrice: '120' },
//     { description: 'Soil health management', unitPrice: '120' },
//     { description: 'Harvesting and post-harvest handling', unitPrice: '120' },
//     { description: 'Pest and disease management', unitPrice: '120' },
//     { description: 'Water management', unitPrice: '120' },
//     { description: 'Crop care and maintenance', unitPrice: '120' },
//   ];
  
//   const aquaShineServices = [
//     { description: 'Express Exterior Wash - Sedan, Small Bakkie, Hatchback', unitPrice: '70' },
//     { description: 'Express Exterior Wash - SUV', unitPrice: '80' },
//     { description: 'Express Exterior Wash - Big Bakkie', unitPrice: '100' },
//     { description: 'Full Exterior Wash and Interior Detailing - Sedan, Small Bakkie, Hatchback', unitPrice: '200' },
//     { description: 'Full Exterior Wash and Interior Detailing - SUV', unitPrice: '230' },
//     { description: 'Full Exterior Wash and Interior Detailing - Big Bakkie', unitPrice: '250' },
//     { description: 'Basic Exterior and Interior Bundle - Sedan, Small Bakkie, Hatchback', unitPrice: '150' },
//     { description: 'Basic Exterior and Interior Bundle - SUV', unitPrice: '170' },
//     { description: 'Basic Exterior and Interior Bundle - Big Bakkie', unitPrice: '190' },
//   ];


//     const allServices = [
//       ...bodyRevampServices,
//       ...insightfulJourneyServices,
//       ...sitNStayServices,
//       ...tidyPatchServices,
//       ...flairServices,
//       ...stitched4UServices,
//       ...learnerHubServices,
//       ...collectifyServices,
//       ...beautyAndBestServices,
//       ...cropMinderServices,
//       ...aquaShineServices,
//     ];

//     for (const serviceData of allServices) {
//       const serviceOffer = this.serviceOfferRepository.create({
//         ...serviceData,
//       });
//       await this.serviceOfferRepository.save(serviceOffer);
//     }
//   }
// }