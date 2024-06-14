import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCascadeInComplianceEntity1718341963591
  implements MigrationInterface
{
  name = "AddingCascadeInComplianceEntity1718341963591";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
