import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDigifranchiseIdInfo1709226650713
  implements MigrationInterface
{
  name = "UpdateDigifranchiseIdInfo1709226650713";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a"`,
    );
    // Drop unique constraint using DROP INDEX instead of DROP CONSTRAINT
    await queryRunner.query(
      `DROP INDEX IF EXISTS "REL_628ee3d8e80b874079732697d6" CASCADE;`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "ownedDigifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "ownedDigifranchiseId" character varying NOT NULL`,
    );
    // Drop unique constraint using DROP INDEX instead of DROP CONSTRAINT
    await queryRunner.query(
      `DROP INDEX IF EXISTS "REL_aaf18ed9b15cc56f76043dc0d5" CASCADE;`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "ownedDigifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD "ownedDigifranchiseId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "ownedDigifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD "ownedDigifranchiseId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "REL_aaf18ed9b15cc56f76043dc0d5" UNIQUE ("ownedDigifranchiseId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "ownedDigifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "ownedDigifranchiseId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "REL_628ee3d8e80b874079732697d6" UNIQUE ("ownedDigifranchiseId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
