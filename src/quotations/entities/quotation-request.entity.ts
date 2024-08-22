import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { QuotationEntity } from "./quotation.entity";
import { DigifranchiseProduct } from "src/digifranchise/entities/digifranchise-product.entity";
import { DigifranchiseServiceOffered } from "src/digifranchise/entities/digifranchise-service-offered.entity";
import { DigifranchiseServiceCategory } from "src/digifranchise/entities/digifranchise-service-category.entity";
import { DigifranchiseSubServices } from "src/digifranchise/entities/digifranchise-sub-service.entity";
import { DigifranchiseSubProduct } from "src/digifranchise/entities/digifranchise-sub-product.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

@Entity("quotation_request")
export class QuotationRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255 })
  fullName: string;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedDigifranchise) => ownedDigifranchise,
    {
      cascade: true,
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "ownedDigifranchiseId" })
  ownedDigifranchiseId: DigifranchiseOwner;

  // @ManyToOne(() => QuotationEntity, (quotation) => quotation.quotationRequest, {
  //   onDelete: "CASCADE",
  //   // cascade: true,
  //   // nullable: true,
  // })
  // @JoinColumn({ name: "quotation" })
  // quotation: QuotationEntity;

  @OneToOne(() => QuotationEntity, (quotation) => quotation.quotationRequest, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "quotation" })
  quotation: QuotationEntity;

  @ManyToOne(() => DigifranchiseProduct, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product" })
  product?: DigifranchiseProduct;

  @ManyToOne(() => DigifranchiseServiceOffered, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "service" })
  service?: DigifranchiseServiceOffered;

  @ManyToOne(
    () => DigifranchiseSubServices,
    // (subService) => subService.quotationItem,
    {
      nullable: true,
      cascade: true,
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "subService" })
  subService?: DigifranchiseSubServices;

  @ManyToOne(() => DigifranchiseServiceCategory, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "serviceCategory" })
  serviceCategory?: DigifranchiseServiceCategory;

  @ManyToOne(() => DigifranchiseSubProduct, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "subProduct" })
  subProduct?: DigifranchiseSubProduct;

  @Column({ type: "integer" })
  quantity: number;

  @Column({ type: "decimal" })
  price: number;

  @Column({ type: "timestamp", nullable: true })
  expiryDate: Date;

  @Column({ type: "timestamp", nullable: true })
  provisionHours: Date;

  @Column({ type: "varchar", length: 255 })
  digifranchiseUrl: string;
}
