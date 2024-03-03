import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigifranchiseComplianceInfo } from './entities/digifranchise-compliance-information.entity';
import { UpdateDigifranchiseComplianceInfoDto } from './dto/update-digifranchise-compliance-info.dto';

@Injectable()
export class DigifranchiseComplianceInfoService {
  constructor(
    @InjectRepository(DigifranchiseComplianceInfo)
    private readonly digifranchiseComplianceInfoRepository: Repository<DigifranchiseComplianceInfo>
  ) { }

  async getDigifranchiseComplianceInformation(userId: string, ownedDigifranchiseId: string): Promise<DigifranchiseComplianceInfo> {
    const digifranchiseComplianceInfo = await this.digifranchiseComplianceInfoRepository.findOne({ where: { ownedDigifranchiseId } })

    if (!digifranchiseComplianceInfo) {
      throw new NotFoundException(
        `digifranchise info not found`,
      );
    }

    // if (digifranchiseComplianceInfo.id !== userId) {
    //   throw new NotFoundException(
    //     `digifranchise not owned by current user`,
    //   );
    // }

    return digifranchiseComplianceInfo
  }

  async updateDigifranchiseComplianceInformation(userId: string, dto: UpdateDigifranchiseComplianceInfoDto, ownedDigifranchiseId: string): Promise<DigifranchiseComplianceInfo> {
    const digifranchiseComplianceInfo = await this.digifranchiseComplianceInfoRepository.findOne({ where: { ownedDigifranchiseId } })
    if (!digifranchiseComplianceInfo) {
      throw new NotFoundException(
        `digifranchise info not found`,
      );
    }

    // if (digifranchiseComplianceInfo.id !== userId) {
    //   throw new NotFoundException(
    //     `digifranchise not owned by current user`,
    //   );
    // }

    digifranchiseComplianceInfo.companyRegisterationNumber = dto.companyRegisterationNumber
    digifranchiseComplianceInfo.taxNumber = dto.taxNumber
    digifranchiseComplianceInfo.vatNumber = dto.vatNumber
    digifranchiseComplianceInfo.taxClearencePin = dto.taxClearencePin
    digifranchiseComplianceInfo.taxClearenceExpiration = dto.taxClearenceExpiration,
    digifranchiseComplianceInfo.coidaRegisteration = dto.coidaRegisteration
    digifranchiseComplianceInfo.uifRegistration = dto.uifRegistration
    digifranchiseComplianceInfo.workMansCompensation = dto.workMansCompensation
    digifranchiseComplianceInfo.sdlNumber = dto.sdlNumber
    digifranchiseComplianceInfo.otherComplianceDocs = dto.otherComplianceDocs
    digifranchiseComplianceInfo.uploadedDocs = dto.uploadedDocs

    const savedComplianceInfo = this.digifranchiseComplianceInfoRepository.save(digifranchiseComplianceInfo)
    console.log(savedComplianceInfo)

    return savedComplianceInfo
  }
}
