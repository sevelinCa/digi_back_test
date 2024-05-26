import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "src/roles/infrastructure/persistence/relational/entities/role.entity";
import { RoleEnum } from "src/roles/roles.enum";
import { Repository } from "typeorm";

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const countCustomer = await this.repository.count({
      where: {
        id: RoleEnum.customer,
      },
    });

    if (!countCustomer) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.customer,
          name: "Customer",
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin,
          name: "Admin",
        }),
      );
    }

    const countSuperAdmin = await this.repository.count({
      where: {
        id: RoleEnum.super_admin,
      },
    });

    if (!countSuperAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.super_admin,
          name: "Super Admin",
        }),
      );
    }

    const countDigifranchiseSuperAdmin = await this.repository.count({
      where: {
        id: RoleEnum.digifranchise_super_admin,
      },
    });

    if (!countDigifranchiseSuperAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.digifranchise_super_admin,
          name: "Digifranchise Super Admin",
        }),
      );
    }

    const countDigifranchiseUser = await this.repository.count({
      where: {
        id: RoleEnum.digifranchise_user,
      },
    });

    if (!countDigifranchiseUser) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.digifranchise_user,
          name: "Digifranchise User",
        }),
      );
    }
  }
}
