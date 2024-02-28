import { MigrationInterface, QueryRunner } from "typeorm";

export class EditDigifranchiseGeneralInfo1709057891060 implements MigrationInterface {
    name = 'EditDigifranchiseGeneralInfo1709057891060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ALTER COLUMN "ownedDigifranchiseId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ALTER COLUMN "ownedDigifranchiseId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
