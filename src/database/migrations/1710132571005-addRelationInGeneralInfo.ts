import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationInGeneralInfo1710132571005
  implements MigrationInterface
{
  name = "AddRelationInGeneralInfo1710132571005";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "ownedDigifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "ownedDigifranchiseId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "UQ_628ee3d8e80b874079732697d61" UNIQUE ("ownedDigifranchiseId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "UQ_628ee3d8e80b874079732697d61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "ownedDigifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "ownedDigifranchiseId" character varying NOT NULL`,
    );
  }
}
