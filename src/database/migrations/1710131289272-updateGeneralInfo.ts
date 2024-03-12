import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGeneralInfo1710131289272 implements MigrationInterface {
    name = 'UpdateGeneralInfo1710131289272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD "useOtherMobileNumberForWebsite" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP COLUMN "useOtherMobileNumberForWebsite"`);
    }

}
