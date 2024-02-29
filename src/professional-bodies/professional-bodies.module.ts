import { Module } from '@nestjs/common';
import { ProfessionalBodiesService } from './professional-bodies.service';
import { ProfessionalBodiesController } from './professional-bodies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalBodyEntity } from './entities/professional-body.entity';
import { Accreditation } from './entities/professional-accreditation.entity';

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      ProfessionalBodyEntity,
      Accreditation
    ]
  )],
  providers: [ProfessionalBodiesService],
  controllers: [ProfessionalBodiesController],
  exports: [ProfessionalBodiesService]
})
export class ProfessionalBodiesModule { }
