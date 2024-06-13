import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { DigifranchiseGeneralInfo } from 'src/digifranchise/entities/digifranchise-general-information.entity';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class OptionalFunctionalService {

  constructor(
    @InjectRepository(DigifranchiseGeneralInfo)
    private readonly generalInfoRepository: Repository<DigifranchiseGeneralInfo>,
    
    @InjectRepository(DigifranchiseOwner)
    private readonly ownerRepository: Repository<DigifranchiseOwner>,
    
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    
  ) {}

  async removeOwnerByPhoneNumber(phoneNumber: string): Promise<void> {
    // Find the general info based on the provided phone number
    const generalInfo = await this.generalInfoRepository.findOne({
      where: [
        { connectNumberWithOutCountryCode: phoneNumber },
        { otherMobileNumberWithOutCountryCode: phoneNumber }
      ],
      relations: ['digifranchiseOwner']
    });

    if (!generalInfo) {
      throw new Error('Owner with the given phone number not found');
    }

    const ownerId = generalInfo.digifranchiseOwner?.id;

    if (!ownerId) {
      throw new Error('Owner information not found for the given phone number');
    }

    // Find the owner
    const owner = await this.ownerRepository.findOne({ where: { id: ownerId }, relations: ['digifranchise'] });

    if (!owner) {
      throw new Error('Owner not found');
    }



    // Remove the owner
    await this.ownerRepository.remove(owner);
  }
}


