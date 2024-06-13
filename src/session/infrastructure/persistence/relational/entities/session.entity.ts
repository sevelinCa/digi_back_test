import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from "typeorm";
import { UserEntity } from "../../../../../users/infrastructure/persistence/relational/entities/user.entity";
import { EntityRelationalHelper } from "src/utils/relational-entity-helper";
import { Session } from "../../../../domain/session";

@Entity({
  name: "session",
})
export class SessionEntity extends EntityRelationalHelper implements Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions, {
    eager: true,
    onDelete: "CASCADE",
  })
  @Index()
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
