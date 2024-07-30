import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateConsultationTableDto } from "./dto/consultations.dto";
import { ConsultationTable } from "./entities/consultation.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { AvailabilityTimeSlots } from "src/calendar/entities/time-slots.entity";

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(ConsultationTable)
    private readonly consultationRepository: Repository<CreateConsultationTableDto>,
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(AvailabilityTimeSlots)
    private readonly digifranchiseAvailableTimeSlotsRepository: Repository<AvailabilityTimeSlots>,
  ) {}

  async createConsultation(
    consultation: CreateConsultationTableDto,
    ownedDigifranchiseId: string,
  ) {
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedDigifranchiseId },
      });
    if (!getOwnedDigifranchise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "Owned Digifranchise does not exist",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const data = { ...consultation, ownedDigifranchise: ownedDigifranchiseId };
    const timeslots = consultation.bookedTimeSlots;
    try {
      for (const slot of timeslots) {
        const updatedTimeSlot =
          await this.digifranchiseAvailableTimeSlotsRepository.update(slot.id, {
            isSlotAvailable: false,
            isSlotBooked: true,
          });
      }
      const response = await this.consultationRepository.save(data);
      return {
        message: "Consultation saved successfully",
        data: response,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getConsultations() {
    try {
      const response = await this.consultationRepository.find();
      return { message: "Consultations", data: response };
    } catch (error) {
      console.log(error);
    }
  }
}
