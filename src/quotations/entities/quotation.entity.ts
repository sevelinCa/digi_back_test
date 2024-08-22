import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { QuotationRequest } from "./quotation-request.entity";

@Entity("quotations")
export class QuotationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => QuotationRequest, (quotationRequest) => quotationRequest, {
    nullable: false,
  })
  @JoinColumn({ name: "quotationRequest" })
  quotationRequest: QuotationRequest;

  // @OneToMany(
  //   () => QuotationRequest,
  //   (quotationRequest) => quotationRequest.quotation,
  //   {
  //     cascade: true,
  //     onDelete: "CASCADE",
  //     nullable: false,
  //   }
  // )
  // @JoinColumn({ name: "quotationRequest" })
  // quotationRequest: QuotationRequest;

  @Column({ type: "boolean", default: false })
  isOrdered: boolean;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0.0,
  })
  totalPrice: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0.0,
  })
  taxAmount: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deletedAt: Date;
}
