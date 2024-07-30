import { SupplierManagement } from "./../../digifranchise-mgt/entities/supplier-management.entity";
import { CustomerManagement } from "./../../digifranchise-mgt/entities/customer-management.entity";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { DigifranchiseGeneralInfo } from "./digifranchise-general-information.entity";
import { DigifranchiseComplianceInfo } from "./digifranchise-compliance-information.entity";
import { DigifranchiseGalleryImage } from "./digifranchise-gallery-images.entity";
import { DigifranchiseExpense } from "./digifranchise-expense.entity";
import { DigifranchiseSelectProductOrServiceTable } from "./digifranchise-select-product-service.entity";
import { DigifranchiseServiceOffered } from "./digifranchise-service-offered.entity";
import { AvailableManagement } from "src/digifranchise-mgt/entities/available-management.entity";
import { UnavailableManagement } from "src/digifranchise-mgt/entities/unavailable-management.entity";
// import { CustomerSubscription } from 'src/digifranchise-mgt/entities/customer-subscription.entity';
import { InventoryManagement } from "src/digifranchise-mgt/entities/inventory-management.entity";
import { DigifranchiseSubServices } from "./digifranchise-sub-service.entity";
import { OrderTable } from "src/payment/entities/order.entity";
import { DigifranchiseSubProduct } from "./digifranchise-sub-product.entity";
import { StaffManagement } from "src/digifranchise-mgt/entities/staff-management.entity";
import { DigifranchiseProduct } from "./digifranchise-product.entity";
import { CalenderVenue } from "src/calender-mgt/entities/calender-venues.entity";
import {
  Availability,
  AvailabilityDayTime,
  AvailabilitySlotsTimeOneOne,
  AvailabilityWeekDays,
  Unavailability,
} from "src/digifranchise-mgt/entities/availability.entity";
import { DigifranchiseWorkingHours } from "src/calendar/entities/digifranchise-working-hours.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";

@Entity()
export class DigifranchiseOwner {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: UserEntity | null;

  @Column({ type: "varchar", length: 255 })
  userEmail: string;

  @Column({ type: "varchar", length: 255 })
  digifranchiseId: string;

  @ManyToOne(() => Digifranchise, { onDelete: "CASCADE" })
  @JoinColumn({ name: "digifranchise" })
  digifranchise: Digifranchise;

  @OneToOne(
    () => DigifranchiseGeneralInfo,
    (digifranchiseInfo) => digifranchiseInfo.digifranchiseOwner,
    { cascade: true, onDelete: "CASCADE" },
  )
  digifranchiseGeneralInfo: DigifranchiseGeneralInfo;

  @OneToOne(
    () => DigifranchiseComplianceInfo,
    (digifranchiseInfo) => digifranchiseInfo.digifranchiseOwner,
    { cascade: true, onDelete: "CASCADE" },
  )
  digifranchiseComplianceInfo: DigifranchiseComplianceInfo;

  @OneToMany(
    () => DigifranchiseGalleryImage,
    (image) => image.digifranchiseOwnedId,
    { cascade: true, onDelete: "CASCADE" },
  )
  digifranchiseGalleryImage: DigifranchiseGalleryImage[];

  @OneToMany(
    () => DigifranchiseServiceOffered,
    (service) => service.ownedFranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  serviceOffered: DigifranchiseServiceOffered[];

  @OneToMany(() => DigifranchiseProduct, (product) => product.ownedFranchise, {
    cascade: true,
    onDelete: "CASCADE",
  })
  productOffered: DigifranchiseProduct[];

  @OneToMany(
    () => DigifranchiseSubServices,
    (owner) => owner.digifranchiseOwnedId,
    { cascade: true, onDelete: "CASCADE" },
  )
  subService: DigifranchiseSubServices[];

  @OneToMany(
    () => DigifranchiseSubProduct,
    (owner) => owner.digifranchiseOwnedId,
    { cascade: true, onDelete: "CASCADE" },
  )
  subProduct: DigifranchiseSubProduct[];

  @OneToMany(
    () => DigifranchiseExpense,
    (ownedFranchise) => ownedFranchise.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  digifranchiseExpense: DigifranchiseExpense[];

  @OneToMany(
    () => DigifranchiseSelectProductOrServiceTable,
    (selectItem) => selectItem.ownerDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  selectItem: DigifranchiseSelectProductOrServiceTable[];

  @OneToMany(
    () => DigifranchiseWorkingHours,
    (availability) => availability.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  availability: DigifranchiseWorkingHours[];

  @OneToMany(
    () => UnavailableManagement,
    (unavailability) => unavailability.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  unavailability: UnavailableManagement[];

  // @OneToMany(() => CustomerSubscription, subscription => subscription.ownedDigifranchise)
  // subscription: CustomerSubscription[];

  @OneToMany(
    () => CustomerManagement,
    (customer) => customer.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  customer: CustomerManagement[];

  @OneToMany(() => StaffManagement, (staff) => staff.ownedDigifranchise, {
    cascade: true,
    onDelete: "CASCADE",
  })
  staff: StaffManagement[];

  @OneToMany(
    () => SupplierManagement,
    (supplier) => supplier.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  supplier: SupplierManagement[];

  @OneToMany(
    () => InventoryManagement,
    (inventory) => inventory.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  inventory: InventoryManagement[];

  @OneToMany(() => CalenderVenue, (venue) => venue.ownedFranchiseId, {
    cascade: true,
    onDelete: "CASCADE",
  })
  venue: CalenderVenue[];

  @OneToMany(() => OrderTable, (orders) => orders.ownedDigifranchise, {
    cascade: true,
    onDelete: "CASCADE",
  })
  order: OrderTable[];

  @OneToMany(
    () => Availability,
    (availability) => availability.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  availabilityTime: Availability[];

  @OneToMany(
    () => AvailabilityWeekDays,
    (availableWeekDay) => availableWeekDay.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  availableWeekDay: AvailabilityWeekDays[];

  @OneToMany(
    () => AvailabilityDayTime,
    (availableDay) => availableDay.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  availableDay: AvailabilityDayTime[];

  @OneToMany(
    () => Unavailability,
    (unavailability) => unavailability.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  unavailabilityTime: Unavailability[];

  @OneToMany(
    () => AvailabilitySlotsTimeOneOne,
    (singleSlot) => singleSlot.availability,
    { cascade: true, onDelete: "CASCADE" },
  )
  singleSlot: AvailabilitySlotsTimeOneOne[];

  // @OneToMany(() => UnavailabilityWeekDays, unavailableWeekDay => unavailableWeekDay.ownedDigifranchise)
  // unavailableWeekDay: UnavailabilityWeekDays[];

  @OneToMany(
    () => Unavailability,
    (unavailableDay) => unavailableDay.ownedDigifranchise,
    { cascade: true, onDelete: "CASCADE" },
  )
  unavailableDay: Unavailability[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
