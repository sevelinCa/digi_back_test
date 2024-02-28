import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accreditation } from 'src/professional-bodies/entities/professional-accreditation.entity';
import { ProfessionalBodyEntity } from 'src/professional-bodies/entities/professional-body.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProfessionalBodySeedService {
  constructor(
    @InjectRepository(ProfessionalBodyEntity)
    private professionalBodyRepo: Repository<ProfessionalBodyEntity>,
    @InjectRepository(Accreditation)
    private accreditationBodyRepo: Repository<Accreditation>,
  ) {}

  async run() {
    const professionalBody1 = await this.professionalBodyRepo.save(
      this.professionalBodyRepo.create({
        id: uuidv4(),
        professionalBodyName: "Professional Body 1"
      })
    )

    const professionalBody2 = await this.professionalBodyRepo.save(
      this.professionalBodyRepo.create({
        id: uuidv4(),
        professionalBodyName: "Professional Body 2"
      })
    )

    await this.accreditationBodyRepo.save(
      this.accreditationBodyRepo.create({
        id: uuidv4(),
        accreditationName: "Accreditation - Professionale Body 1",
        professionalBodyId: professionalBody1.id
      })
    )

    await this.accreditationBodyRepo.save(
      this.accreditationBodyRepo.create({
        id: uuidv4(),
        accreditationName: "Accreditation 2 - Professionale Body 1",
        professionalBodyId: professionalBody1.id
      })
    )

    await this.accreditationBodyRepo.save(
      this.accreditationBodyRepo.create({
        id: uuidv4(),
        accreditationName: "Accreditation 3 - Professionale Body 1",
        professionalBodyId: professionalBody1.id
      })
    )

    await this.accreditationBodyRepo.save(
      this.accreditationBodyRepo.create({
        id: uuidv4(),
        accreditationName: "Accreditation 1 - Professionale Body 2",
        professionalBodyId: professionalBody2.id
      })
    )

    await this.accreditationBodyRepo.save(
      this.accreditationBodyRepo.create({
        id: uuidv4(),
        accreditationName: "Accreditation 2 - Professionale Body 2",
        professionalBodyId: professionalBody2.id
      })
    )
  }
}
