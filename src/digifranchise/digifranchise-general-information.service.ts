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

@Injectable()
export class DigifranchiseGeneralInfoService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Digifranchise)
    private digifranchiseRepository: Repository<Digifranchise>,
    @InjectRepository(DigifranchiseOwner)
    private digifranchiseOwnersRepository: Repository<DigifranchiseOwner>,
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

    if (digifranchiseGeneralInfo.id !== userId) {
      throw new NotFoundException(
        `digifranchise not owned by current user`,
      );
    }

    return digifranchiseGeneralInfo
  }

  async updateDigifranchiseGeneralInformation(userId: string, generalInfo: UpdateDigifranchiseGeneralInfoDto, ownedDigifranchiseId: string): Promise<DigifranchiseGeneralInfo> {
    const digifranchiseGeneralInfo = await this.digifranchiseGeneralInfoRepository.findOne({ where: { ownedDigifranchiseId } })
    if (!digifranchiseGeneralInfo) {
      throw new NotFoundException(
        `digifranchise info not found`,
      );
    }

    if (digifranchiseGeneralInfo.id !== userId) {
      throw new NotFoundException(
        `digifranchise not owned by current user`,
      );
    }

    // await 

    return digifranchiseGeneralInfo
  }
}
