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

  async deleteUserByConnectNumber(connectNumber: string): Promise<void> {
    if (!connectNumber) {
      throw new Error("Connect number must be provided");
    }

    const generalInfo = await this.generalInfoRepository.findOne({
      where: [
        { connectNumberWithOutCountryCode: connectNumber },
        { otherMobileNumberWithOutCountryCode: connectNumber },
      ],
    });

    if (!generalInfo) {
      throw new NotFoundException(
        `DigifranchiseGeneralInfo with connect number or other mobile number ${connectNumber} not found`,
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

  async deleteByUserEmail(email: string): Promise<void> {
    if (!email) {
      throw new Error("Email must be provided");
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const franchiseOwner = await this.franchiseOwnerRepository.findOne({
      where: {
        userId: Equal(user.id),
        userEmail: email,
      },
    });

    if (!franchiseOwner) {
      throw new NotFoundException(
        `DigifranchiseOwner with email ${email} not found`,
      );
    }

    await this.franchiseOwnerRepository.remove(franchiseOwner);
    await this.userRepository.remove(user);
  }

  async deleteByUserPhoneNumber(phoneNumber: string): Promise<void> {
    if (!phoneNumber) {
      throw new Error("Phone Number must be provided");
    }

    const user = await this.userRepository.findOne({ where: { phoneNumber } });
    if (!user) {
      throw new NotFoundException(
        `User with Phone Number ${phoneNumber} not found`,
      );
    }

    await this.userRepository.remove(user);
  }
}
