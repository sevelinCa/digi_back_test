import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConsultationTableDto } from './dto/consultations.dto';
import { ConsultationTable } from './entities/consultation.entity';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { AvailabilityTimeSlots } from 'src/calendar/entities/time-slots.entity';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(ConsultationTable)
    private readonly consultationRepository: Repository<ConsultationTable>,
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(AvailabilityTimeSlots)
    private readonly digifranchiseAvailableTimeSlotsRepository: Repository<AvailabilityTimeSlots>
  ) {}

  async createConsultation(
    consultation: CreateConsultationTableDto,
    ownedFranchiseId: string
  ) {
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedFranchiseId },
      });
    console.log(getOwnedDigifranchise);
    if (!ownedFranchiseId || !getOwnedDigifranchise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Owned Digifranchise does not exist',
        },
        HttpStatus.NOT_FOUND
      );
    }
    const data = { ...consultation, ownedDigifranchise: getOwnedDigifranchise };
    try {
      const response = await this.consultationRepository.save(data);
      return {
        message: 'Consultation saved successfully',
        data: response,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getConsultations(ownedDigifranchiseId: string) {
    try {
      const response = await this.consultationRepository.find({
        where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
        relations: ['ownedDigifranchise'],
      });
      return { message: 'Consultations', data: response };
    } catch (error) {
      console.log(error);
    }
  }
}
