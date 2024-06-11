import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DigifranchiseWorkingHours } from 'src/calendar/entities/digifranchise-working-hours.entity';
import { CalenderVenue } from 'src/calender-mgt/entities/calender-venues.entity';
import { Availability, AvailabilityWeekDays, AvailabilityDayTime, Unavailability, AvailabilitySlotsTimeOneOne } from 'src/digifranchise-mgt/entities/availability.entity';
import { CustomerManagement } from 'src/digifranchise-mgt/entities/customer-management.entity';
import { InventoryManagement } from 'src/digifranchise-mgt/entities/inventory-management.entity';
import { StaffManagement } from 'src/digifranchise-mgt/entities/staff-management.entity';
import { SupplierManagement } from 'src/digifranchise-mgt/entities/supplier-management.entity';
import { UnavailableManagement } from 'src/digifranchise-mgt/entities/unavailable-management.entity';
import { DigifranchiseExpense } from 'src/digifranchise/entities/digifranchise-expense.entity';
import { DigifranchiseGalleryImage } from 'src/digifranchise/entities/digifranchise-gallery-images.entity';
import { DigifranchiseGeneralInfo } from 'src/digifranchise/entities/digifranchise-general-information.entity';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { DigifranchiseSelectProductOrServiceTable } from 'src/digifranchise/entities/digifranchise-select-product-service.entity';
import { DigifranchiseServiceOffered } from 'src/digifranchise/entities/digifranchise-service-offered.entity';
import { DigifranchiseSubProduct } from 'src/digifranchise/entities/digifranchise-sub-product.entity';
import { DigifranchiseSubServices } from 'src/digifranchise/entities/digifranchise-sub-service.entity';
import { OrderTable } from 'src/payment/entities/order.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Repository, Equal } from 'typeorm';


@Injectable()
export class OptionalFunctionalService {
  constructor(
    @InjectRepository(DigifranchiseGeneralInfo)
    private readonly generalInfoRepository: Repository<DigifranchiseGeneralInfo>,

    @InjectRepository(DigifranchiseOwner)
    private readonly ownerRepository: Repository<DigifranchiseOwner>,

    @InjectRepository(DigifranchiseGalleryImage)
    private readonly galleryImageRepository: Repository<DigifranchiseGalleryImage>,

    @InjectRepository(DigifranchiseExpense)
    private readonly expenseRepository: Repository<DigifranchiseExpense>,

    @InjectRepository(DigifranchiseServiceOffered)
    private readonly serviceOfferedRepository: Repository<DigifranchiseServiceOffered>,

    @InjectRepository(DigifranchiseSubServices)
    private readonly subServiceRepository: Repository<DigifranchiseSubServices>,

    @InjectRepository(DigifranchiseSubProduct)
    private readonly subProductRepository: Repository<DigifranchiseSubProduct>,

    @InjectRepository(DigifranchiseSelectProductOrServiceTable)
    private readonly selectProductOrServiceRepository: Repository<DigifranchiseSelectProductOrServiceTable>,

    @InjectRepository(DigifranchiseWorkingHours)
    private readonly workingHoursRepository: Repository<DigifranchiseWorkingHours>,

    @InjectRepository(UnavailableManagement)
    private readonly unavailableManagementRepository: Repository<UnavailableManagement>,

    @InjectRepository(CustomerManagement)
    private readonly customerManagementRepository: Repository<CustomerManagement>,

    @InjectRepository(StaffManagement)
    private readonly staffManagementRepository: Repository<StaffManagement>,

    @InjectRepository(SupplierManagement)
    private readonly supplierManagementRepository: Repository<SupplierManagement>,

    @InjectRepository(InventoryManagement)
    private readonly inventoryManagementRepository: Repository<InventoryManagement>,

    @InjectRepository(CalenderVenue)
    private readonly calenderVenueRepository: Repository<CalenderVenue>,

    @InjectRepository(OrderTable)
    private readonly orderTableRepository: Repository<OrderTable>,

    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,

    @InjectRepository(AvailabilityWeekDays)
    private readonly availabilityWeekDaysRepository: Repository<AvailabilityWeekDays>,

    @InjectRepository(AvailabilityDayTime)
    private readonly availabilityDayTimeRepository: Repository<AvailabilityDayTime>,

    @InjectRepository(Unavailability)
    private readonly unavailabilityRepository: Repository<Unavailability>,

    @InjectRepository(AvailabilitySlotsTimeOneOne)
    private readonly availabilitySlotsTimeOneOneRepository: Repository<AvailabilitySlotsTimeOneOne>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, 
  ) {}

  async deleteAllByConnectNumber(connectNumber: string): Promise<void> {
    if (!connectNumber) {
      throw new Error('connectNumber must be provided');
    }

    const generalInfo = await this.generalInfoRepository.findOne({ where: { connectNumberWithOutCountryCode: Equal(connectNumber) } });

    if (generalInfo) {
      const ownerId = generalInfo.digifranchiseOwner.id;

      const owner = await this.ownerRepository.findOne({ where: { id: Equal(ownerId) } });

      if (owner) {
        await this.galleryImageRepository.delete({ digifranchiseOwnedId: Equal(ownerId) });
        await this.expenseRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.serviceOfferedRepository.delete({ ownedFranchise: Equal(ownerId) });
        await this.subServiceRepository.delete({ digifranchiseOwnedId: Equal(ownerId) });
        await this.subProductRepository.delete({ digifranchiseOwnedId: Equal(ownerId) });
        await this.selectProductOrServiceRepository.delete({ ownerDigifranchise: Equal(ownerId) });
        await this.workingHoursRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.unavailableManagementRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.customerManagementRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.staffManagementRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.supplierManagementRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.inventoryManagementRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.calenderVenueRepository.delete({ ownedFranchiseId: Equal(ownerId) });
        await this.orderTableRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.availabilityRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.availabilityWeekDaysRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.availabilityDayTimeRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.unavailabilityRepository.delete({ ownedDigifranchise: Equal(ownerId) });
        await this.availabilitySlotsTimeOneOneRepository.delete({ ownedDigifranchise: Equal(ownerId) });

        const user = await this.userRepository.findOne({ where: { id: Equal(owner.userId) } });
        if (user) {
          await this.userRepository.remove(user);
        }

      }
      if (owner!== null) {
        await this.ownerRepository.remove(owner);
    }
      await this.generalInfoRepository.remove(generalInfo);
    }
  }
}
