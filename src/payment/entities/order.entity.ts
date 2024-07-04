import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { DigifranchiseProduct } from "src/digifranchise/entities/digifranchise-product.entity";
import { DigifranchiseServiceOffered } from "src/digifranchise/entities/digifranchise-service-offered.entity";
import { DigifranchiseSubProduct } from "src/digifranchise/entities/digifranchise-sub-product.entity";
import { DigifranchiseSubServices } from "src/digifranchise/entities/digifranchise-sub-service.entity";
import {
  OrderComplaintsTable,
  OrderIssueTable,
} from "src/rating/entities/Complaints.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  DECLINED = "DECLINED",
  COMPLETE = "COMPLETE",
}

@Entity()
export class OrderTable {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: UserEntity | null;

  @ManyToOne(() => DigifranchiseProduct, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  productId: DigifranchiseProduct | null;

  @ManyToOne(() => DigifranchiseServiceOffered, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "serviceId" })
  serviceId: DigifranchiseServiceOffered | null;

  @OneToMany(() => OrderBasicInfo, (basicInfo) => basicInfo.order, { cascade: true, onDelete: "CASCADE" })
  basicInfos: OrderBasicInfo[];

  @OneToMany(() => OrderComplaintsTable, (complaints) => complaints.order, { cascade: true, onDelete: "CASCADE" })
  Complaints: OrderComplaintsTable[];

  @OneToMany(() => OrderIssueTable, (issue) => issue.order, { cascade: true, onDelete: "CASCADE" })
  issues: OrderIssueTable[];

  @ManyToOne(() => DigifranchiseSubProduct, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "subProduct" })
  subProduct: DigifranchiseSubProduct | null;

  @ManyToOne(() => DigifranchiseSubServices, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "subService" })
  subService: DigifranchiseSubServices | null;

  @ManyToOne(() => DigifranchiseOwner, (ownedFranchise) => ownedFranchise.order, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @Column({ type: "json", nullable: true })
  orderAdditionalInfo: any[];

  @Column({ type: "integer" })
  quantity: number;

  @Column({ type: "integer" })
  orderNumber: number;

  @Column({ type: "varchar" })
  orderCode: string;

  @Column({ type: "varchar", length: 255 })
  unitPrice: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  OrderDate: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  vatAmount: number | null;

  @Column({ default: false })
  useEscrow: boolean;
  
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}

@Entity()
export class OrderBasicInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => OrderTable, (order) => order.basicInfos, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order" })
  order: OrderTable;

  @Column({ type: "text" })
  fullNames: string;

  @Column({ type: "text" })
  contactDetails: string;

  @Column({ type: "text" })
  address: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
