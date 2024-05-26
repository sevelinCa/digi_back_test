import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProfessionalBodyEntity } from "./entities/professional-body.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Accreditation } from "./entities/professional-accreditation.entity";

@Injectable()
export class ProfessionalBodiesService {
  constructor(
    @InjectRepository(ProfessionalBodyEntity)
    private readonly professionalBodiesRepository: Repository<ProfessionalBodyEntity>,
    @InjectRepository(Accreditation)
    private readonly accredritationsRepository: Repository<Accreditation>,
  ) {}

  async getProfessionalBodies(): Promise<ProfessionalBodyEntity[]> {
    const professionalBodies = await this.professionalBodiesRepository.find();
    const getAccreditationsFromDB = await this.accredritationsRepository.find();

    const accreditationsByProfessionalBodyId = getAccreditationsFromDB.reduce(
      (acc, accreditation) => {
        const { professionalBodyId } = accreditation;
        if (!acc[professionalBodyId]) {
          acc[professionalBodyId] = [];
        }
        acc[professionalBodyId].push(accreditation);
        return acc;
      },
      {},
    );

    const professionalBodiesWithAccreditations = professionalBodies.map(
      (professionalBody) => ({
        ...professionalBody,
        accreditations:
          accreditationsByProfessionalBodyId[professionalBody.id] || [],
      }),
    );

    return professionalBodiesWithAccreditations;
  }
}
