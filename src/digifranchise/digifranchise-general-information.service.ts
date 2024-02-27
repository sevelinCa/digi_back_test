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

  async getDigifranchiseGeneralInformation(userId: string, ownedDigifranchiseId: string) {
    console.log('<<<<<<<<<<', userId)
    console.log('>>>>>>>>>>', ownedDigifranchiseId)
    // const digifranchise = await this.digifranchiseOwnersRepository.findOne({ digifranchiseId: ownedDigifranchiseId })

    // if (!digifranchise) {
    //   throw new NotFoundException(
    //     `digifranchise account not found`,
    //   );
    // }

    // if (digifranchise.id !== userId) {
    //   throw new NotFoundException(
    //     `digifranchise not owned by current user`,
    //   );
    // }

    // return this.digifranchiseGeneralInfoRepository.findOne({ where: { id: ownedDigifranchiseId } })
  }
}
