import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublishedWebsiteBoolean1710406474676 implements MigrationInterface {
    name = 'AddPublishedWebsiteBoolean1710406474676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD "digifranchisePublished" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP COLUMN "digifranchisePublished"`);
    }

}
