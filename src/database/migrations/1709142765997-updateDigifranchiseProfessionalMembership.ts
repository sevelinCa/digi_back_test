import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDigifranchiseProfessionalMembership1709142765997
  implements MigrationInterface
{
  name = "UpdateDigifranchiseProfessionalMembership1709142765997";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "accreditation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "digifranchiseName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "facebookHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "tiktokHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "instagramHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "xHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "connectNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "otherMobileNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "aboutCompany"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "location"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "professionalOrganization"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "renewelDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "professionalOrganizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "accreditationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "renewelDate" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "digifranchiseName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "facebookHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "tiktokHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "instagramHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "xHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "address" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "connectNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "otherMobileNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "aboutCompany" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "location" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "location"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "aboutCompany"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "otherMobileNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "connectNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "xHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "instagramHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "tiktokHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "facebookHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "digifranchiseName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "renewelDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "accreditationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "professionalOrganizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "renewelDate" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "professionalOrganization" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "location" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "aboutCompany" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "otherMobileNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "connectNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "address" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "xHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "instagramHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "tiktokHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "facebookHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "digifranchiseName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "accreditation" character varying NOT NULL`,
    );
  }
}
