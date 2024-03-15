import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigifranchiseGeneralInfo } from './entities/digifranchise-general-information.entity';
import { UpdateDigifranchiseGeneralInfoDto } from './dto/update-digifranchise-general-info.dto';

@Injectable()
export class DigifranchiseGeneralInfoService {
  constructor(
    @InjectRepository(DigifranchiseGeneralInfo)
    private readonly digifranchiseGeneralInfoRepository: Repository<DigifranchiseGeneralInfo>,
  ) { }

  async getDigifranchiseGeneralInformation(userId: string, ownedDigifranchiseId: string): Promise<DigifranchiseGeneralInfo> {
    const digifranchiseGeneralInfo = await this.digifranchiseGeneralInfoRepository.findOne({ where: { ownedDigifranchiseId } })

    if (!digifranchiseGeneralInfo) {
      throw new NotFoundException(
        `digifranchise info not found`,
      );
    }

    return digifranchiseGeneralInfo
  }

  async updateDigifranchiseGeneralInformation(userId: string, dto: UpdateDigifranchiseGeneralInfoDto, ownedDigifranchiseId: string): Promise<DigifranchiseGeneralInfo> {
    const digifranchiseGeneralInfo = await this.digifranchiseGeneralInfoRepository.findOne({ where: { ownedDigifranchiseId } })
    if (!digifranchiseGeneralInfo) {
      throw new NotFoundException(
        `digifranchise info not found`,
      );
    }

    if (
      (digifranchiseGeneralInfo.connectNumber !== dto.connectNumber || 
        digifranchiseGeneralInfo.otherMobileNumber !== dto.connectNumber) &&
        digifranchiseGeneralInfo.digifranchisePublished
      ) {
        throw new ConflictException(
          "to update phone numbers for digifranchise, please first unpublish the current version, make the necessary changes, and then republish."
        )
      }
    
    digifranchiseGeneralInfo.digifranchiseName = dto.digifranchiseName
    digifranchiseGeneralInfo.facebookHandle = dto.facebookHandle
    digifranchiseGeneralInfo.tiktokHandle = dto.tiktokHandle
    digifranchiseGeneralInfo.instagramHandle = dto.instagramHandle
    digifranchiseGeneralInfo.xHandle = dto.xHandle
    digifranchiseGeneralInfo.address = dto.address
    digifranchiseGeneralInfo.connectNumber = dto.connectNumber
    digifranchiseGeneralInfo.otherMobileNumber = dto.otherMobileNumber
    digifranchiseGeneralInfo.aboutCompany = dto.aboutCompany
    digifranchiseGeneralInfo.location = dto.location

    this.digifranchiseGeneralInfoRepository.save(digifranchiseGeneralInfo)

    return digifranchiseGeneralInfo
  }
}
