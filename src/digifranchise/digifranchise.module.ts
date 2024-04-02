import { Module } from '@nestjs/common';
import { DigifranchiseController, DigifranchiseOptionEndpoint } from './digifranchise.controller';
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
import { DigifranchiseGalleryImage } from './entities/digifranchise-gallery-images.entity';
import { DigifranchiseServiceCategory } from './entities/digifranchise-service-category.entity';
import { DigifranchiseSelectProductOrServiceTable } from './entities/digifranchise-select-product-service.entity';
import { DigifranchiseImagesService } from './digifranchise-images.service';
import { DigifranchiseImagesController } from './digifranchise-images.controller';
import { DigifranchiseSelectItemService } from './digifranchise-select-item.service';
import { DigifranchiseSelectItemController } from './digifranchise-select-item.controller';
import { DigifranchiseSubServiceCategory } from './entities/digifranchise-sub-service-category.entity';
import { DigifranchiseExpenseService } from './digifranchise-expense.service';
import { DigifranchiseExpenseController } from './digifranchise-expense.controller';
import { DigifranchiseExpense } from './entities/digifranchise-expense.entity';
import { FixedExpenseCategory } from 'src/accounting/entities/fixedExpenseCategory.entity';

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
      DigifranchiseGalleryImage,
      DigifranchiseServiceCategory,
      DigifranchiseSelectProductOrServiceTable,
      DigifranchiseSubServiceCategory,
      DigifranchiseSubProduct,
      DigifranchiseExpense,
      FixedExpenseCategory

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
    DigifranchiseImagesController,
    DigifranchiseSelectItemController,
    DigifranchiseOptionEndpoint,
    DigifranchiseExpenseController
  ],
  providers: [
    DigifranchiseService,
    DigifranchiseGeneralInfoService,
    DigifranchiseComplianceInfoService,
    DigifranchiseProfessionalBodyMembershipService,
    ProductService,
    DigifranchiseImagesService,
    DigifranchiseSelectItemService,
    DigifranchiseExpenseService,
  ]
})
export class DigifranchiseModule { }