import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateComplianceEntity1709544821652 implements MigrationInterface {
  name = "UpdateComplianceEntity1709544821652";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "uploadedDocs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD "taxClearenceExpiration" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD "vatNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "companyRegisterationNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "taxNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "taxClearencePin" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "coidaRegisteration" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "uifRegistration" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "workMansCompensation" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "sdlNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "otherComplianceDocs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD "otherComplianceDocs" json`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "otherComplianceDocs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD "otherComplianceDocs" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "sdlNumber" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "workMansCompensation" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "uifRegistration" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "coidaRegisteration" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "taxClearencePin" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "taxNumber" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "companyRegisterationNumber" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "vatNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "taxClearenceExpiration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD "uploadedDocs" character varying NOT NULL`,
    );
  }
}
