import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFranchiseNameOnDigifranchiseAccountTable1708508273472 implements MigrationInterface {
    name = 'AddFranchiseNameOnDigifranchiseAccountTable1708508273472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "franchiseName" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "franchiseName"`);
    }

}
