import { Exclude, Expose } from "class-transformer";
// import { FileType } from 'src/files/domain/file';
import { Role } from "src/roles/domain/role";
import { Status } from "src/statuses/domain/status";
import { PrimaryGeneratedColumn } from "typeorm";
import {
  Crimes,
  ProfessionalBody,
  Qualifications,
} from "../infrastructure/persistence/relational/entities/user.entity";

export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Expose({ groups: ["me", "admin"] })
  email: string | null;

  @Expose({ groups: ["me", "admin"] })
  dateOfBirth?: Date | null;

  @Expose({ groups: ["me", "admin"] })
  phoneNumber: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @Expose({ groups: ["me", "admin"] })
  provider: string;

  @Expose({ groups: ["me", "admin"] })
  socialId?: string | null;

  @Expose({ groups: ["me", "admin"] })
  image: string | null;

  @Expose({ groups: ["me", "admin"] })
  idImage: string | null;

  @Expose({ groups: ["me", "admin"] })
  gender: string | null;

  @Expose({ groups: ["me", "admin"] })
  race: string | null;

  @Expose({ groups: ["me", "admin"] })
  homeAddress: string | null;

  @Expose({ groups: ["me", "admin"] })
  educationLevel: string | null;

  @Expose({ groups: ["me", "admin"] })
  currentActivity: string | null;

  @Expose({ groups: ["me", "admin"] })
  fieldOfStudy: string | null;

  @Expose({ groups: ["me", "admin"] })
  qualifications: Qualifications[] | null;

  @Expose({ groups: ["me", "admin"] })
  professionalBody: ProfessionalBody[] | null;

  @Expose({ groups: ["me", "admin"] })
  southAfricanCitizen: boolean | null;

  @Expose({ groups: ["me", "admin"] })
  documentId: string | null;

  @Expose({ groups: ["me", "admin"] })
  countryOfOrigin: string | null;

  @Expose({ groups: ["me", "admin"] })
  criminalRecord: boolean | null;

  @Expose({ groups: ["me", "admin"] })
  policeClearenceCertificate: string | null;

  @Expose({ groups: ["me", "admin"] })
  crimes: Crimes[] | null;

  @Expose({ groups: ["me", "admin"] })
  isProfileComplete: boolean;

  firstName: string | null;
  lastName: string | null;
  // photo?: FileType | null;
  role?: Role | null;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deleteAt: Date | null;
}
