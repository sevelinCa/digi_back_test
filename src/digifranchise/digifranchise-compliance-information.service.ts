import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service.entity';
import { checkIfDigifranchiseExists } from 'src/helper/FindByFunctions';
import type { CreateDigifranchiseServiceOfferedDto, UpdateDigifranchiseServiceOfferedDto } from './dto/create-digifranchiseServiceOffered.dto';
import { DigifranchiseGeneralInfo } from './entities/digifranchise-general-information.entity';
import { UpdateDigifranchiseGeneralInfoDto } from './dto/update-digifranchise-general-info.dto';
import { DigifranchiseComplianceInfo } from './entities/digifranchise-compliance-information.entity';
import { UpdateDigifranchiseComplianceInfoDto } from './dto/update-digifranchise-compliance-info.dto';

@Injectable()
export class DigifranchiseComplianceInfoService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Digifranchise)
    private digifranchiseRepository: Repository<Digifranchise>,
    @InjectRepository(DigifranchiseOwner)
    private digifranchiseOwnersRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(DigifranchiseGeneralInfo)
    private readonly digifranchiseGeneralInfoRepository: Repository<DigifranchiseGeneralInfo>,
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

    if (digifranchiseComplianceInfo.id !== userId) {
      throw new NotFoundException(
        `digifranchise not owned by current user`,
      );
    }

    return digifranchiseComplianceInfo
  }

  async updateDigifranchiseComplianceInformation(userId: string, dto: UpdateDigifranchiseComplianceInfoDto, ownedDigifranchiseId: string): Promise<DigifranchiseComplianceInfo> {
    const digifranchiseComplianceInfo = await this.digifranchiseComplianceInfoRepository.findOne({ where: { ownedDigifranchiseId } })
    if (!digifranchiseComplianceInfo) {
      throw new NotFoundException(
        `digifranchise info not found`,
      );
    }

    if (digifranchiseComplianceInfo.id !== userId) {
      throw new NotFoundException(
        `digifranchise not owned by current user`,
      );
    }

    digifranchiseComplianceInfo.companyRegisterationNumber = dto.companyRegisterationNumber
    digifranchiseComplianceInfo.taxNumber = dto.taxNumber
    digifranchiseComplianceInfo.taxClearencePin = dto.taxClearencePin
    digifranchiseComplianceInfo.uifRegistration = dto.uifRegistration
    digifranchiseComplianceInfo.workMansCompensation = dto.workMansCompensation
    digifranchiseComplianceInfo.sdlNumber = dto.sdlNumber
    digifranchiseComplianceInfo.otherComplianceDocs = dto.otherComplianceDocs
    digifranchiseComplianceInfo.uploadedDocs = dto.uploadedDocs

    this.digifranchiseGeneralInfoRepository.save(digifranchiseComplianceInfo)

    return digifranchiseComplianceInfo
  }
}
