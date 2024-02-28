import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigifranchiseProfessionalBodyMembership } from './entities/digifranchise-professional-body-membership.entity';
import { AddProfessionalMembershipDto } from './dto/add-digifranchise-professional-membership.dto';

@Injectable()
export class DigifranchiseProfessionalBodyMembershipService {
  constructor(
    @InjectRepository(DigifranchiseProfessionalBodyMembership)
    private readonly digifranchiseProfessionalMembershipRepository: Repository<DigifranchiseProfessionalBodyMembership>
  ) { }

  async getDigifranchiseProfessionalMemberships(ownedDigifranchiseId: string): Promise<DigifranchiseProfessionalBodyMembership> {
    const digifranchiseProfessionalMemberInfo = await this.digifranchiseProfessionalMembershipRepository.findOne({ where: { ownedDigifranchiseId }})

    if (!digifranchiseProfessionalMemberInfo) {
      throw new NotFoundException(
        `digifranchise info not found`,
      );
    }
    return digifranchiseProfessionalMemberInfo
  }

  async addDigifranchiseProfessionalMembership(ownedDigifranchiseId: string, dto: AddProfessionalMembershipDto): Promise<DigifranchiseProfessionalBodyMembership> {
      const createProfMembership = this.digifranchiseProfessionalMembershipRepository.create({
        ownedDigifranchiseId,
        professionalOrganizationId: dto.professionalBodyId,
        accreditationId: dto.accreditationId,
        renewalDate: dto.renewalDate
      })

      return this.digifranchiseProfessionalMembershipRepository.save(createProfMembership)
    }
  
}
