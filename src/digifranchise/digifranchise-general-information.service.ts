import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DigifranchiseGeneralInfo } from "./entities/digifranchise-general-information.entity";
import { UpdateDigifranchiseGeneralInfoDto } from "./dto/update-digifranchise-general-info.dto";
import {
  isValidPhoneNumber,
  removeCountryCode,
} from "src/utils/phone-number-validation";

@Injectable()
export class DigifranchiseGeneralInfoService {
  constructor(
    @InjectRepository(DigifranchiseGeneralInfo)
    private readonly digifranchiseGeneralInfoRepository: Repository<DigifranchiseGeneralInfo>,
  ) { }

  async getDigifranchiseGeneralInformation(
    userId: string,
    ownedDigifranchiseId: string,
  ): Promise<DigifranchiseGeneralInfo> {
    const digifranchiseGeneralInfo =
      await this.digifranchiseGeneralInfoRepository.findOne({
        where: { ownedDigifranchiseId },
      });

    if (!digifranchiseGeneralInfo) {
      throw new NotFoundException(`digifranchise info not found`);
    }

    return digifranchiseGeneralInfo;
  }

  async updateDigifranchiseGeneralInformation(
    userId: string,
    dto: UpdateDigifranchiseGeneralInfoDto,
    ownedDigifranchiseId: string,
  ): Promise<DigifranchiseGeneralInfo> {
    const digifranchiseGeneralInfo =
      await this.digifranchiseGeneralInfoRepository.findOne({
        where: { ownedDigifranchiseId },
      });
    if (!digifranchiseGeneralInfo) {
      throw new NotFoundException(`digifranchise info not found`);
    }

    if (
      (digifranchiseGeneralInfo.connectNumber !== dto.connectNumber ||
        digifranchiseGeneralInfo.otherMobileNumber !== dto.connectNumber) &&
      digifranchiseGeneralInfo.digifranchisePublished
    ) {
      throw new ConflictException(
        "to update phone numbers for digifranchise, please first unpublish the current version, make the necessary changes, and then republish.",
      );
    }

    if (dto.connectNumber !== undefined) {
      if (dto.connectNumber.trim() !== "") {
        if (!isValidPhoneNumber(dto.connectNumber)) {
          throw new ConflictException("please include country code");
        }
      }
    }

    if (dto.otherMobileNumber !== undefined) {
      if (dto.otherMobileNumber.trim() !== "") {
        if (!isValidPhoneNumber(dto.otherMobileNumber)) {
          throw new ConflictException("please include country code");
        }
      }
    }

    const connectNumberWithoutCC =
      dto.connectNumber !== undefined
        ? removeCountryCode(dto.connectNumber)
        : "";
    const otherMobileWithoutCC =
      dto.otherMobileNumber !== undefined
        ? removeCountryCode(dto.otherMobileNumber)
        : "";

    if (connectNumberWithoutCC === otherMobileWithoutCC) {
      throw new ConflictException(
        "connect number and other number cannot be the same",
      );
    }

    const findExistingCC =
      await this.digifranchiseGeneralInfoRepository.findOne({
        where: [
          { connectNumberWithOutCountryCode: connectNumberWithoutCC },
          { otherMobileNumberWithOutCountryCode: connectNumberWithoutCC },
        ]
      });

    if (
      findExistingCC !== null &&
      findExistingCC?.ownedDigifranchiseId !== ownedDigifranchiseId
    ) {
      throw new ConflictException(
        "connect number is already being used by another digifranchise",
      );
    }

    const findExistingOtherMobile =
      await this.digifranchiseGeneralInfoRepository.findOne({
        where: [
          { otherMobileNumberWithOutCountryCode: otherMobileWithoutCC },
          { connectNumberWithOutCountryCode: otherMobileWithoutCC }
        ],
      });


    if (
      findExistingOtherMobile !== null &&
      findExistingOtherMobile?.ownedDigifranchiseId !== ownedDigifranchiseId
    ) {
      throw new ConflictException(
        "other number is already being used by another digifranchise",
      );
    }

    digifranchiseGeneralInfo.digifranchiseName = dto.digifranchiseName;
    digifranchiseGeneralInfo.facebookHandle = dto.facebookHandle;
    digifranchiseGeneralInfo.tiktokHandle = dto.tiktokHandle;
    digifranchiseGeneralInfo.instagramHandle = dto.instagramHandle;
    digifranchiseGeneralInfo.xHandle = dto.xHandle;
    digifranchiseGeneralInfo.address = dto.address;
    digifranchiseGeneralInfo.connectNumber = dto.connectNumber;
    digifranchiseGeneralInfo.otherMobileNumber = dto.otherMobileNumber;
    digifranchiseGeneralInfo.aboutCompany = dto.aboutCompany;
    digifranchiseGeneralInfo.location = dto.location;
    digifranchiseGeneralInfo.digifranchisePublishedWithCC =
      dto.digifranchisePublishedWithCC;

    Object.assign(digifranchiseGeneralInfo, {
      connectNumberWithOutCountryCode: connectNumberWithoutCC,
    });
    Object.assign(digifranchiseGeneralInfo, {
      otherMobileNumberWithOutCountryCode: otherMobileWithoutCC,
    });

    this.digifranchiseGeneralInfoRepository.save(digifranchiseGeneralInfo);

    return digifranchiseGeneralInfo;
  }
}
