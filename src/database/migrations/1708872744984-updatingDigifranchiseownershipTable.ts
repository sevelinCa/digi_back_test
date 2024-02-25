import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatingDigifranchiseownershipTable1708872744984 implements MigrationInterface {
    name = 'UpdatingDigifranchiseownershipTable1708872744984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "userFullNames"`);
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "franchiseName"`);
        await queryRunner.query(`ALTER TABLE "franchise_ownership" ADD "userId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "franchise_ownership" ADD "userFullNames" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "digifranchiseName" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "digifranchiseName"`);
        await queryRunner.query(`ALTER TABLE "franchise_ownership" DROP COLUMN "userFullNames"`);
        await queryRunner.query(`ALTER TABLE "franchise_ownership" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "franchiseName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "userFullNames" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "userId" character varying(255) NOT NULL`);
    }

}
