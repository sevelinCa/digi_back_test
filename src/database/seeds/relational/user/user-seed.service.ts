import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEnum } from 'src/roles/roles.enum';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
      },
    });

    if (!countAdmin) {
      
      if(process.env.SUPER_ADMIN_PASS) {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(process.env.SUPER_ADMIN_PASS, salt);

        await this.repository.save(
          this.repository.create({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@example.com',
            password,
            role: {
              id: RoleEnum.super_admin,
              name: 'Super Admin',
            },
            status: {
              id: StatusEnum.active,
              name: 'Active',
            },
          }),
        );
      } else {
        console.log("super admin password not provided")
      }

    }
  }
}
