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

@Entity()
export class DigifranchiseServiceCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  serviceCategoryName: string;

  @Column({ type: "varchar", length: 255 })
  unitPrice: string;

  @Column({ type: "text" })
  description: string;

  @ManyToOne(
    () => DigifranchiseServiceOffered,
    (service) => service.serviceCategories,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "serviceId" })
  service: DigifranchiseServiceOffered;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
