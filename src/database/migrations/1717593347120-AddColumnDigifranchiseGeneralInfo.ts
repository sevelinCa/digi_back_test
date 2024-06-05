import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnDigifranchiseGeneralInfo1717593347120 implements MigrationInterface {
    name = 'AddColumnDigifranchiseGeneralInfo1717593347120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD "digifranchisePublishedWithCC" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP COLUMN "digifranchisePublishedWithCC"`);
    }

}
