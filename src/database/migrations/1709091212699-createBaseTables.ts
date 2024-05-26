import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBaseTables1709091212699 implements MigrationInterface {
  name = "CreateBaseTables1709091212699";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "phoneNumber" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "image" character varying, "idImage" character varying, "gender" character varying, "race" character varying, "homeAddress" character varying, "educationLevel" character varying, "currentActivity" character varying, "fieldOfStudy" character varying, "qualifications" json, "professionalBody" json, "isProfileComplete" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deleteAt" TIMESTAMP, "roleId" integer, "statusId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3bd3f2e16165d1dac3e8e13286" ON "user" ("image") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d03cc9951fbb73d092fa53127e" ON "user" ("idImage") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a0f3f1de3c7590ddf4299b6596" ON "user" ("gender") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91c1ef85a7e6c89eaeec99bfd6" ON "user" ("race") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9086fd0adfc3fdd84a443dd1b1" ON "user" ("homeAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_083056026899d829066008244b" ON "user" ("educationLevel") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_772c766ebfc783bb03fa5e3404" ON "user" ("currentActivity") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5e03f420f37f1f2270ec3f7a9" ON "user" ("fieldOfStudy") `,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a5e03f420f37f1f2270ec3f7a9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_772c766ebfc783bb03fa5e3404"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_083056026899d829066008244b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9086fd0adfc3fdd84a443dd1b1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91c1ef85a7e6c89eaeec99bfd6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a0f3f1de3c7590ddf4299b6596"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d03cc9951fbb73d092fa53127e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3bd3f2e16165d1dac3e8e13286"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
