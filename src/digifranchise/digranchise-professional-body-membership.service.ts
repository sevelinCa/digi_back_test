import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigifranchiseProfessionalBodyMembership } from './entities/digifranchise-professional-body-membership.entity';
import { AddProfessionalMembershipDto } from './dto/add-digifranchise-professional-membership.dto';
import { ProfessionalBodyEntity } from 'src/professional-bodies/entities/professional-body.entity';
import { Accreditation } from 'src/professional-bodies/entities/professional-accreditation.entity';

@Injectable()
export class DigifranchiseProfessionalBodyMembershipService {
  constructor(
    @InjectRepository(ProfessionalBodyEntity)
    private readonly professionalBodyEntityRepository: Repository<ProfessionalBodyEntity>,
    @InjectRepository(Accreditation)
    private readonly accreditationRepository: Repository<Accreditation>,
    @InjectRepository(DigifranchiseProfessionalBodyMembership)
    private readonly digifranchiseProfessionalMembershipRepository: Repository<DigifranchiseProfessionalBodyMembership>
  ) { }

  async getDigifranchiseProfessionalMemberships(ownedDigifranchiseId: string): Promise<any[]> {
    const digifranchiseProfessionalMemberInfo = await this.digifranchiseProfessionalMembershipRepository.find({ where: { ownedDigifranchiseId } })

    if (!digifranchiseProfessionalMemberInfo) {
      throw new NotFoundException(
        `digifranchise info not found`,
      );
    }

    const accrediations = await Promise.all(digifranchiseProfessionalMemberInfo.map(async (professionalBodyInfo) => {
      const getProfessionaOrg = await this.professionalBodyEntityRepository.findOne({ where: { id: professionalBodyInfo.professionalOrganizationId } })
      const getAccrediation = await this.accreditationRepository.findOne({ where: { id: professionalBodyInfo.accreditationId } })
      const accreditationInfo = { ...getProfessionaOrg, accrediation: getAccrediation, renewalDate: professionalBodyInfo.renewalDate }
      return accreditationInfo
    }))

    return accrediations
  }

  async addDigifranchiseProfessionalMembership(ownedDigifranchiseId: string, dto: AddProfessionalMembershipDto): Promise<DigifranchiseProfessionalBodyMembership> {
    const getProfessionalBody = await this.professionalBodyEntityRepository.findOne({ where: { id: dto.professionalBodyId.toString() } })
    if (!getProfessionalBody) {
      throw new ConflictException(
        'professional body does not exist'
      )
    }

    const getAccrediation = await this.accreditationRepository.findOne({ where: { id: dto.accreditationId } })
    if (!getAccrediation) {
      throw new ConflictException(
        'professional accreditation does not exist'
      )
    }

    if (getAccrediation.professionalBodyId !== getProfessionalBody.id) {
      throw new ConflictException(
        'professional body does not provide the accreditation'
      )
    }

    const existingProfAccreditationForDigifranchise = await this.digifranchiseProfessionalMembershipRepository.findOne({ where: { accreditationId: dto.accreditationId } })
    if (existingProfAccreditationForDigifranchise?.ownedDigifranchiseId === ownedDigifranchiseId) {
      throw new ConflictException(
        'accreditation already created by this digifranchise'
      )
    }

    const createProfMembership = this.digifranchiseProfessionalMembershipRepository.create({
      ownedDigifranchiseId,
      professionalOrganizationId: dto.professionalBodyId,
      accreditationId: dto.accreditationId,
      renewalDate: dto.renewalDate
    })

    return this.digifranchiseProfessionalMembershipRepository.save(createProfMembership)
  }

}
