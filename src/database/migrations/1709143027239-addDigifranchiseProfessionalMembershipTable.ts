import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDigifranchiseProfessionalMembershipTable1709143027239
  implements MigrationInterface
{
  name = "AddDigifranchiseProfessionalMembershipTable1709143027239";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "digifranchise_professional_body_membership" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ownedDigifranchiseId" character varying NOT NULL, "professionalOrganizationId" character varying NOT NULL, "accreditationId" character varying NOT NULL, "renewelDate" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_dc8fefde0a7baa2b9d683b97be0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "professionalOrganizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "accreditationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "renewelDate"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "renewelDate" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "accreditationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "professionalOrganizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `DROP TABLE "digifranchise_professional_body_membership"`,
    );
  }
}
