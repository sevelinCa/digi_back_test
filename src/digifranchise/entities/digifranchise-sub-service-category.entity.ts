import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { DigifranchiseSubServices } from "./digifranchise-sub-service.entity";

@Entity()
export class DigifranchiseSubServiceCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  serviceCategoryName: string;

  @Column({ type: "varchar", length: 255 })
  unitPrice: string;

  @Column({ type: "text" })
  description: string;

  @ManyToOne(
    () => DigifranchiseSubServices,
    (subService) => subService.subServiceCategories,
  )
  subService: DigifranchiseSubServices;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
