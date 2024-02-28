import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProfessionalBodyEntity } from './entities/professional-body.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class ProfessionalBodiesService {
  constructor(
    @InjectRepository(ProfessionalBodyEntity)
    private readonly professionalBodiesRepository: Repository<ProfessionalBodyEntity>
  ) {}

  async getProfessionalBodies(): Promise<ProfessionalBodyEntity[]> {
    return this.professionalBodiesRepository.find()
  }
}
