import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Digifranchise } from "./digifranchise.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { DigifranchiseServiceCategory } from "./digifranchise-service-category.entity";
import { DigifranchiseGalleryImage } from "./digifranchise-gallery-images.entity";
import { DigifranchiseSelectProductOrServiceTable } from "./digifranchise-select-product-service.entity";
import { DigifranchiseOwner } from "./digifranchise-ownership.entity";
@Entity()
export class DigifranchiseServiceOffered {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Digifranchise, { onDelete: "CASCADE" })
  @JoinColumn({ name: "digifranchiseId" })
  digifranchiseId: Digifranchise;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: UserEntity | null;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedItem) => ownedItem.serviceOffered,
    { nullable: true, onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "digifranchiseOwnedId" })
  ownedFranchise: DigifranchiseOwner | null;

  @OneToMany(
    () => DigifranchiseGalleryImage,
    (image) => image.digifranchiseServiceId,
    { cascade: true, onDelete: "CASCADE" }
  )
  serviceGalleryImages: DigifranchiseGalleryImage[];

  @OneToMany(
    () => DigifranchiseSelectProductOrServiceTable,
    (selectItem) => selectItem.digifranchiseService,
    { cascade: true, onDelete: "CASCADE" }
  )
  selectedItem: DigifranchiseSelectProductOrServiceTable[];

  @Column({ type: "text" })
  serviceName: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "varchar", length: 255 })
  unitPrice: string;

  @OneToMany(
    () => DigifranchiseServiceCategory,
    (category) => category.service,
    { cascade: true, onDelete: "CASCADE" }
  )
  serviceCategories: DigifranchiseServiceCategory[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
