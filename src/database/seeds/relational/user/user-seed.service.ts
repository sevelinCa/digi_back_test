import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StatusEnum } from "src/statuses/statuses.enum";
import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { RoleEnum } from "src/roles/roles.enum";

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async run() {
    const adminExists = await this.userRepository.findOne({
      where: {
        email: "admin@digifranchise.co.za",
      },
    });

    if (!adminExists) {
      if (process.env.SUPER_ADMIN_PASS) {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(process.env.SUPER_ADMIN_PASS, salt);

        await this.userRepository.save(
          this.userRepository.create({
            firstName: "Super",
            lastName: "Admin",
            email: "admin@digifranchise.co.za",
            password,
            role: {
              id: RoleEnum.super_admin,
              name: "Super Admin",
            },
            status: {
              id: StatusEnum.active,
              name: "Active",
            },
          }),
        );
      } else {
        console.log("Super admin password not provided");
      }
    }

    await this.seedUsers();
  }

  private async seedUsers() {
    const users = [
      {
        id: "0beef94a-1234-4f8f-b5c9-a29c01505e56",
        email: "user1@example.com",
        phoneNumber: "0788111222",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("1990-01-01"),
        role: {
          id: RoleEnum.customer,
          name: "Customer",
        },
        status: {
          id: StatusEnum.active,
          name: "Active",
        },
        qualifications: [
          {
            qualificationName: "Bachelor of Science",
            institution: "University of Example",
            yearObtained: new Date("2012-06-01"),
            qualificationCopy: "path/to/qualificationCopy.pdf",
          },
        ],
        professionalBody: [
          {
            professionalBody: "Example Professional Body",
            certificateName: "Certificate of Membership",
            certificateCopy: "path/to/certificateCopy.pdf",
            dateObtained: new Date("2015-05-01"),
            expiryDate: new Date("2025-05-01"),
          },
        ],
        crimes: [
          {
            crimeName: "None",
          },
        ],
      },
      {
        id: "0beef94a-e1ca-4321-b5c9-a29c01505e56",
        email: "user2@example.com",
        phoneNumber: "0788111333",
        password: "password123",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: new Date("1985-05-15"),
        role: {
          id: RoleEnum.customer,
          name: "Customer",
        },
        status: {
          id: StatusEnum.active,
          name: "Active",
        },
        qualifications: [
          {
            qualificationName: "Master of Business Administration",
            institution: "Business School Example",
            yearObtained: new Date("2014-06-01"),
            qualificationCopy: "path/to/qualificationCopy.pdf",
          },
        ],
        professionalBody: [
          {
            professionalBody: "Business Professional Body",
            certificateName: "MBA Certification",
            certificateCopy: "path/to/certificateCopy.pdf",
            dateObtained: new Date("2016-05-01"),
            expiryDate: new Date("2026-05-01"),
          },
        ],
        crimes: [
          {
            crimeName: "None",
          },
        ],
      },
      {
        id: "0beef94a-9876-4f8f-b5c9-a29c01505e56",
        email: "user3@example.com",
        phoneNumber: "0788111444",
        password: "password123",
        firstName: "Alice",
        lastName: "Johnson",
        dateOfBirth: new Date("1992-08-25"),
        role: {
          id: RoleEnum.customer,
          name: "Customer",
        },
        status: {
          id: StatusEnum.active,
          name: "Active",
        },
        qualifications: [
          {
            qualificationName: "Doctor of Philosophy",
            institution: "Research University",
            yearObtained: new Date("2018-09-01"),
            qualificationCopy: "path/to/qualificationCopy.pdf",
          },
        ],
        professionalBody: [
          {
            professionalBody: "Research Professional Body",
            certificateName: "PhD Certification",
            certificateCopy: "path/to/certificateCopy.pdf",
            dateObtained: new Date("2019-05-01"),
            expiryDate: new Date("2029-05-01"),
          },
        ],
        crimes: [
          {
            crimeName: "None",
          },
        ],
      },
      {
        id: "0beef94a-6789-4f8f-b5c9-a29c01505e56",
        email: "user4@example.com",
        phoneNumber: "0788111555",
        password: "password123",
        firstName: "Bob",
        lastName: "Williams",
        dateOfBirth: new Date("1988-11-11"),
        role: {
          id: RoleEnum.super_admin,
          name: "Super Admin",
        },
        status: {
          id: StatusEnum.active,
          name: "Active",
        },
        qualifications: [
          {
            qualificationName: "Associate of Arts",
            institution: "Community College",
            yearObtained: new Date("2010-05-01"),
            qualificationCopy: "path/to/qualificationCopy.pdf",
          },
        ],
        professionalBody: [
          {
            professionalBody: "Arts Professional Body",
            certificateName: "Arts Certification",
            certificateCopy: "path/to/certificateCopy.pdf",
            dateObtained: new Date("2011-05-01"),
            expiryDate: new Date("2021-05-01"),
          },
        ],
        crimes: [
          {
            crimeName: "None",
          },
        ],
      },
      {
        id: "0beef94a-5432-4f8f-b5c9-a29c01505e56",
        email: "user5@example.com",
        phoneNumber: "0788111666",
        password: "password123",
        firstName: "Charlie",
        lastName: "Brown",
        dateOfBirth: new Date("1995-03-03"),
        role: {
          id: RoleEnum.customer,
          name: "Customer",
        },
        status: {
          id: StatusEnum.active,
          name: "Active",
        },
        qualifications: [
          {
            qualificationName: "Bachelor of Arts",
            institution: "Liberal Arts College",
            yearObtained: new Date("2016-06-01"),
            qualificationCopy: "path/to/qualificationCopy.pdf",
          },
        ],
        professionalBody: [
          {
            professionalBody: "Liberal Arts Professional Body",
            certificateName: "Liberal Arts Certification",
            certificateCopy: "path/to/certificateCopy.pdf",
            dateObtained: new Date("2017-05-01"),
            expiryDate: new Date("2027-05-01"),
          },
        ],
        crimes: [
          {
            crimeName: "None",
          },
        ],
      },
    ];

    for (const userData of users) {
      const userExists = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (!userExists) {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(userData.password, salt);
        const user = this.userRepository.create({ ...userData, password });
        await this.userRepository.save(user);
      }
    }
  }
}
