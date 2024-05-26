import { MigrationInterface, QueryRunner } from "typeorm";

export class StaffManagmentTables1710132414532 implements MigrationInterface {
  name = "StaffManagmentTables1710132414532";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullNames" text NOT NULL, "email" text NOT NULL, "mobile_number" text NOT NULL, "id_or_passport_number" text NOT NULL, "date_of_birth" TIMESTAMP NOT NULL DEFAULT now(), "role_description" text NOT NULL, "address" text NOT NULL, "date_started" TIMESTAMP NOT NULL DEFAULT now(), "app_access" boolean NOT NULL, "registration_method" text NOT NULL, "tax_number" text NOT NULL, "uif_number" text NOT NULL, "gross_monthly_salary" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "digifranchiseId" uuid, CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "FK_eba76c23bcfc9dad2479b7fd2ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "FK_5ae75ae5af86fe6e006ff574396" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "staff" DROP CONSTRAINT "FK_5ae75ae5af86fe6e006ff574396"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff" DROP CONSTRAINT "FK_eba76c23bcfc9dad2479b7fd2ad"`,
    );
    await queryRunner.query(`DROP TABLE "staff"`);
  }
}
