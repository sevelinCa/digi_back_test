import { MigrationInterface, QueryRunner } from "typeorm";

export class EditBooleanToTrue1717670124923 implements MigrationInterface {
    name = 'EditBooleanToTrue1717670124923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD "digifranchisePublishedWithCC" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP COLUMN "digifranchisePublishedWithCC"`);
    }

}
