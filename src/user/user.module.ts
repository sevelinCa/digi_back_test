import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RelationalUserPersistenceModule } from "src/users/infrastructure/persistence/relational/relational-persistence.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    // RelationalUserPersistenceModule,
    UsersModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
