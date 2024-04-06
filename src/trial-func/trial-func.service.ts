import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { findOwnedDigifranchiseIdByDigifranchiseId, findDigifranchiseIdByDigifranchiseOwnerId } from 'src/helper/Digifranchise-helper-function';

@Injectable()
export class TrialFuncService {
    constructor(
        @InjectRepository(DigifranchiseOwner)
        private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    ) {}

    // async getServicesAndSubServicesByDigifranchiseId(digifranchiseId: string): Promise<{ digifranchiseOwnerId: string | null, digifranchiseId: string | null }> {
    //     const digifranchiseOwnerId = await findOwnedDigifranchiseIdByDigifranchiseId(this.digifranchiseOwnerRepository, digifranchiseId);
    //     if (!digifranchiseOwnerId) {
    //         throw new Error('Owned digifranchise does not exist');
    //     }

    //     const parentDigifranchiseId = await findDigifranchiseIdByDigifranchiseOwnerId(this.digifranchiseOwnerRepository, digifranchiseOwnerId);
    //     if (!parentDigifranchiseId) {
    //         throw new Error('Owned digifranchise does not exist');
    //     }

    //     const servicesOffered = await this.digifranchiseServiceOfferedRepository.find({
    //         where: {
    //           digifranchiseId: Equal(digifranchiseId),
    //           userId: IsNull(),
    //         },
    //         relations: ['digifranchiseId', 'serviceCategories', 'userId',
    //           'serviceGalleryImages',
    //           'selectedItem',
    //           'selectedItem.userId'
    //         ],
    //      });

    //     return { digifranchiseOwnerId, digifranchiseId: parentDigifranchiseId };
    // }
}