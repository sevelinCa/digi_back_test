import { Module } from '@nestjs/common';
import { DigifranchiseController } from './digifranchise.controller';
import { DigifranchiseService } from './digifranchise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service-offered.entity';
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
import { DigifranchiseWebController } from './digifranchise-web.controller';
import { DigifranchiseServiceOfferedController } from './digifranchise-service.controller';
import { DigifranchiseProductController } from './digifranchise-product.controller';
import { DigifranchiseGeneralInfoController } from './digifranchise-general-info.controller';
import { DigifranchiseComplianceInfoController } from './digifranchise-compliance-info.controller';
import { DigifranchiseProfessionalMembershipController } from './digifranchise-professional-membership.controller';
import { DigifranchiseOwnedProduct } from './entities/digifranchise-owned-product.entity';
import { DigifranchiseOwnedServiceOffered } from './entities/digifranchise-owned-service-offered.entity';
import { DigifranchiseOwnedServiceAndProductService } from './digifranchise-owned-service-and-product.service';
import { DigifranchiseOwnedServiceController, DigifranchiseOwnedProductController } from './digifranchise-owned-service-and-product.controller';

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
      Accreditation,
      DigifranchiseOwnedProduct,
      DigifranchiseOwnedServiceOffered
    ]),
  ],
  controllers: [
    DigifranchiseController,
    DigifranchiseServiceOfferedController,
    DigifranchiseProductController,
    DigifranchiseGeneralInfoController,
    DigifranchiseComplianceInfoController,
    DigifranchiseProfessionalMembershipController,
    DigifranchiseWebController,
    DigifranchiseOwnedServiceController,
    DigifranchiseOwnedProductController,
  ],
  providers: [
    DigifranchiseService,
    DigifranchiseGeneralInfoService,
    DigifranchiseComplianceInfoService,
    DigifranchiseProfessionalBodyMembershipService,
    ProductService,
    DigifranchiseOwnedServiceAndProductService,
  ]
})
export class DigifranchiseModule { }