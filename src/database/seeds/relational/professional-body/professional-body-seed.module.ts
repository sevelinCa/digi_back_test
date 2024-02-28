import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalBodySeedService } from './professional-body-seed.service';
import { ProfessionalBodyEntity } from 'src/professional-bodies/entities/professional-body.entity';
import { Accreditation } from 'src/professional-bodies/entities/professional-accreditation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    ProfessionalBodyEntity,
    Accreditation
  ])],
  providers: [ProfessionalBodySeedService],
  exports: [ProfessionalBodySeedService],
})
export class ProfessionalBodySeedModule {}