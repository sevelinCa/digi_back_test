import { SupplierManagement } from './../../digifranchise-mgt/entities/supplier-management.entity';
import { CustomerManagement } from './../../digifranchise-mgt/entities/customer-management.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { DigifranchiseGeneralInfo } from './digifranchise-general-information.entity';
import { DigifranchiseComplianceInfo } from './digifranchise-compliance-information.entity';
import { DigifranchiseGalleryImage } from './digifranchise-gallery-images.entity';
import { DigifranchiseExpense } from './digifranchise-expense.entity';
import { DigifranchiseSelectProductOrServiceTable } from './digifranchise-select-product-service.entity';
import { DigifranchiseServiceOffered } from './digifranchise-service-offered.entity';
import { AvailableManagement } from 'src/digifranchise-mgt/entities/available-management.entity';
import { UnavailableManagement } from 'src/digifranchise-mgt/entities/unavailable-management.entity';
import { CustomerSubscription } from 'src/digifranchise-mgt/entities/customer-subscription.entity';
import { InventoryManagement } from 'src/digifranchise-mgt/entities/inventory-management.entity';
import { DigifranchiseSubServices } from './digifranchise-sub-service.entity';
import { OrderTable } from 'src/payment/entities/order.entity';
import { DigifranchiseSubProduct } from './digifranchise-sub-product.entity';
import { StaffManagement } from 'src/digifranchise-mgt/entities/staff-management.entity';
import { DigifranchiseProduct } from './digifranchise-product.entity';
import { CalenderVenue } from 'src/calender-mgt/entities/calender-venues.entity';
import { Availability, AvailabilityDayTime, AvailabilityWeekDays, Unavailability } from 'src/digifranchise-mgt/entities/availability.entity';

@Entity()
export class DigifranchiseOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  userEmail: string;

  @Column({ type: 'varchar', length: 255 })
  digifranchiseId: string

  @ManyToOne(() => Digifranchise)
  @JoinColumn({ name: 'digifranchise' })
  digifranchise: Digifranchise;

  @OneToOne(() => DigifranchiseGeneralInfo, digifranchiseInfo => digifranchiseInfo.digifranchiseOwner)
  digifranchiseGeneralInfo: DigifranchiseGeneralInfo;

  @OneToOne(() => DigifranchiseComplianceInfo, digifranchiseInfo => digifranchiseInfo.digifranchiseOwner)
  digifranchiseComplianceInfo: DigifranchiseComplianceInfo;

  @OneToMany(() => DigifranchiseGalleryImage, image => image.digifranchiseOwnedId)
  digifranchiseGalleryImage: DigifranchiseGalleryImage[];

  @OneToMany(() => DigifranchiseServiceOffered, service => service.ownedFranchise)
  serviceOffered: DigifranchiseServiceOffered[];

  @OneToMany(() => DigifranchiseProduct, product => product.ownedFranchise)
  productOffered: DigifranchiseProduct[];
  
  @OneToMany(() => DigifranchiseSubServices, owner => owner.digifranchiseOwnedId)
  subService: DigifranchiseSubServices[];

  @OneToMany(() => DigifranchiseSubProduct, owner => owner.digifranchiseOwnedId)
  subProduct: DigifranchiseSubProduct[];

  @OneToMany(() => DigifranchiseExpense, ownedFranchise => ownedFranchise.ownedDigifranchise)
  digifranchiseExpense: DigifranchiseExpense[];

  @OneToMany(() => DigifranchiseSelectProductOrServiceTable, selectItem => selectItem.ownerDigifranchise)
  selectItem: DigifranchiseSelectProductOrServiceTable[];

  @OneToMany(() => AvailableManagement, availability => availability.ownedDigifranchise)
  availability: AvailableManagement[];

  @OneToMany(() => UnavailableManagement, unavailability => unavailability.ownedDigifranchise)
  unavailability: UnavailableManagement[];

  @OneToMany(() => CustomerSubscription, subscription => subscription.ownedDigifranchise)
  subscription: CustomerSubscription[];

  @OneToMany(() => CustomerManagement, customer => customer.ownedDigifranchise)
  customer: CustomerManagement[];

  @OneToMany(() => StaffManagement, staff => staff.ownedDigifranchise)
  staff: StaffManagement[];

  @OneToMany(() => SupplierManagement, supplier => supplier.ownedDigifranchise)
  supplier: SupplierManagement[];

  @OneToMany(() => InventoryManagement, inventory => inventory.ownedDigifranchise)
  inventory: InventoryManagement[];

  @OneToMany(() => CalenderVenue, venue => venue.ownedFranchiseId)
  venue: CalenderVenue[];

  @OneToMany(() => OrderTable, orders => orders.ownedDigifranchise)
  order: OrderTable[];

  @OneToMany(() => Availability, availability => availability.ownedDigifranchise)
  availabilityTime: Availability[];

  @OneToMany(() => AvailabilityWeekDays, availableWeekDay => availableWeekDay.ownedDigifranchise)
  availableWeekDay: AvailabilityWeekDays[];

  @OneToMany(() => AvailabilityDayTime, availableDay => availableDay.ownedDigifranchise)
  availableDay: AvailabilityDayTime[];

  @OneToMany(() => Unavailability, unavailability => unavailability.ownedDigifranchise)
  unavailabilityTime: Unavailability[];

  // @OneToMany(() => UnavailabilityWeekDays, unavailableWeekDay => unavailableWeekDay.ownedDigifranchise)
  // unavailableWeekDay: UnavailabilityWeekDays[];

  @OneToMany(() => Unavailability, unavailableDay => unavailableDay.ownedDigifranchise)
  unavailableDay: Unavailability[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
