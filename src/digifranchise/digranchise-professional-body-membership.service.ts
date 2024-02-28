import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigifranchiseComplianceInfo } from './entities/digifranchise-compliance-information.entity';
import { UpdateDigifranchiseComplianceInfoDto } from './dto/update-digifranchise-compliance-info.dto';
import { DigifranchiseProfessionalBodyMembership } from './entities/digifranchise-professional-body-membership.entity';

@Injectable()
export class DigifranchiseProfessionalBodyMembershipService {
  constructor(
    @InjectRepository(DigifranchiseProfessionalBodyMembership)
    private readonly digifranchiseprofessionalMembershipRepository: Repository<DigifranchiseProfessionalBodyMembership>
  ) { }

  // async getDigifranchiseComplianceInformation(userId: string, ownedDigifranchiseId: string): Promise<DigifranchiseComplianceInfo> {
  //   const digifranchiseComplianceInfo = await this.digifranchiseprofessionalMembershipRepository.findOne({ where: { ownedDigifranchiseId } })

  //   if (!digifranchiseComplianceInfo) {
  //     throw new NotFoundException(
  //       `digifranchise info not found`,
  //     );
  //   }

  //   if (digifranchiseComplianceInfo.id !== userId) {
  //     throw new NotFoundException(
  //       `digifranchise not owned by current user`,
  //     );
  //   }

  //   return digifranchiseComplianceInfo
  // }

  // async updateDigifranchiseComplianceInformation(userId: string, complianceInfo: UpdateDigifranchiseComplianceInfoDto, ownedDigifranchiseId: string): Promise<DigifranchiseComplianceInfo> {
  //   const digifranchiseComplianceInfo = await this.digifranchiseComplianceInfoRepository.findOne({ where: { ownedDigifranchiseId } })
  //   if (!digifranchiseComplianceInfo) {
  //     throw new NotFoundException(
  //       `digifranchise info not found`,
  //     );
  //   }

  //   if (digifranchiseComplianceInfo.id !== userId) {
  //     throw new NotFoundException(
  //       `digifranchise not owned by current user`,
  //     );
  //   }

  //   return digifranchiseComplianceInfo
  // }
}
