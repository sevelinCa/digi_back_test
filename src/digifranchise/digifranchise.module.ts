import { Module } from '@nestjs/common';
import { DigifranchiseComplianceInfoController, DigifranchiseController, DigifranchiseGeneralInfoController, DigifranchiseProductController, DigifranchiseProfessionalMembershipController, DigifranchiseServiceOfferedController } from './digifranchise.controller';
import { DigifranchiseService } from './digifranchise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service.entity';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { DigifranchiseGeneralInfoService } from './digifranchise-general-information.service';
import { DigifranchiseGeneralInfo } from './entities/digifranchise-general-information.entity';
import { DigifranchiseSubServices } from './entities/digifranchise-sub-service.entity';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { ProductService } from './product.service';
import { DigifranchiseSubProduct } from './entities/digifranchise-sub-product.entity';
import { DigifranchiseComplianceInfoService } from './digifranchise-compliance-information.service';
import { DigifranchiseComplianceInfo } from './entities/digifranchise-compliance-information.entity';
import { DigifranchiseProfessionalBodyMembership } from './entities/digifranchise-professional-body-membership.entity';
import { DigifranchiseProfessionalBodyMembershipService } from './digranchise-professional-body-membership.service';
import { ProfessionalBodyEntity } from 'src/professional-bodies/entities/professional-body.entity';
import { Accreditation } from 'src/professional-bodies/entities/professional-accreditation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      DigifranchiseServiceOffered,
      DigifranchiseSubServices,
      DigifranchiseProduct,
      DigifranchiseSubProduct,
      Digifranchise,
      DigifranchiseOwner,
      DigifranchiseGeneralInfo,
      DigifranchiseComplianceInfo,
      DigifranchiseProfessionalBodyMembership,
      ProfessionalBodyEntity,
      Accreditation
    ]),
  ],
  controllers: [
    DigifranchiseController,
    DigifranchiseServiceOfferedController,
    DigifranchiseProductController,
    DigifranchiseGeneralInfoController,
    DigifranchiseComplianceInfoController,
    DigifranchiseProfessionalMembershipController
  ],
  providers: [
    DigifranchiseService, 
    DigifranchiseGeneralInfoService, 
    DigifranchiseComplianceInfoService,
    DigifranchiseProfessionalBodyMembershipService,
    ProductService,
  ]
})
export class DigifranchiseModule {}