import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, Repository } from "typeorm";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { DigifranchiseComplianceInfo } from "src/digifranchise/entities/digifranchise-compliance-information.entity";
import { DigifranchiseGeneralInfo } from "src/digifranchise/entities/digifranchise-general-information.entity";

@Injectable()
export class OptionalFunctionalService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DigifranchiseOwner)
    private readonly franchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(DigifranchiseGeneralInfo)
    private readonly generalInfoRepository: Repository<DigifranchiseGeneralInfo>,
    @InjectRepository(DigifranchiseComplianceInfo)
    private readonly complianceInfoRepository: Repository<DigifranchiseComplianceInfo>,
  ) {}

  async deleteUserByPhoneNumber(phoneNumber: string): Promise<void> {
    if (!phoneNumber) {
      throw new Error("Connect number must be provided");
    }

    const generalInfo = await this.generalInfoRepository.findOne({
      where: [
        { connectNumberWithOutCountryCode: phoneNumber },
        { otherMobileNumberWithOutCountryCode: phoneNumber },
      ],
    });

    if (!generalInfo) {
      throw new NotFoundException(
        `DigifranchiseGeneralInfo with connect number or other mobile number ${phoneNumber} not found`,
      );
    }

    const franchiseOwner = await this.franchiseOwnerRepository.findOne({
      where: { id: generalInfo.ownedDigifranchiseId },
    });
    if (!franchiseOwner) {
      throw new NotFoundException(
        `DigifranchiseOwner with ID ${generalInfo.ownedDigifranchiseId} not found`,
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: franchiseOwner.userId?.id },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${franchiseOwner.userId?.id} not found`,
      );
    }

    await this.franchiseOwnerRepository.remove(franchiseOwner);
    await this.userRepository.remove(user);
  }
}
