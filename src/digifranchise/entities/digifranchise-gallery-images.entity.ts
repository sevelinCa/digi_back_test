import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { DigifranchiseServiceOffered } from "./digifranchise-service-offered.entity";
import { DigifranchiseProduct } from "./digifranchise-product.entity";
import { DigifranchiseOwner } from "./digifranchise-ownership.entity";
import { DigifranchiseSubProduct } from "./digifranchise-sub-product.entity";
import { DigifranchiseSubServices } from "./digifranchise-sub-service.entity";

@Entity()
export class DigifranchiseGalleryImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  imageUrl: string;

  @ManyToOne(
    () => DigifranchiseServiceOffered,
    (service) => service.serviceGalleryImages,
    { nullable: true, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "digifranchiseServiceId" })
  digifranchiseServiceId: DigifranchiseServiceOffered | null;

  @ManyToOne(
    () => DigifranchiseProduct,
    (product) => product.productGalleryImages,
    { nullable: true, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "digifranchiseProductId" })
  digifranchiseProductId: DigifranchiseProduct | null;

  @ManyToOne(
    () => DigifranchiseSubServices,
    (service) => service.subServiceGalleryImages,
    { nullable: true, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "subServiceId" })
  subService: DigifranchiseSubServices | null;

  @ManyToOne(
    () => DigifranchiseSubProduct,
    (product) => product.subProductGalleryImages,
    { nullable: true, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "subProductId" })
  subProduct: DigifranchiseSubProduct | null;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedItem) => ownedItem.digifranchiseGalleryImage,
    { nullable: true, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "digifranchiseOwnedId" })
  digifranchiseOwnedId: DigifranchiseOwner | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
