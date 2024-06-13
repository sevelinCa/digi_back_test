import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { DigifranchiseOwner } from "./digifranchise-ownership.entity";

@Entity()
export class DigifranchiseGeneralInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // General Information
  @OneToOne(() => DigifranchiseOwner, (owner) => owner.digifranchiseId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: "ownedDigifranchiseId" })
  digifranchiseOwner: DigifranchiseOwner;

  @Column({ nullable: true })
  ownedDigifranchiseId: string;

  @Column()
  digifranchiseName: string;

  @Column()
  facebookHandle: string;

  @Column()
  tiktokHandle: string;

  @Column()
  instagramHandle: string;

  @Column()
  xHandle: string;

  @Column()
  address: string;

  @Column()
  connectNumberWithOutCountryCode: string;

  @Column()
  connectNumber: string;

  @Column()
  otherMobileNumberWithOutCountryCode: string;

  @Column()
  otherMobileNumber: string;

  @Column({ default: false })
  useOtherMobileNumberForWebsite: boolean;

  @Column()
  aboutCompany: string;

  @Column()
  location: string;

  @Column({ default: false })
  digifranchisePublished: boolean;

  @Column({ default: true })
  digifranchisePublishedWithCC: boolean

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
