import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDigifranchiseTable1708523142269 implements MigrationInterface {
    name = 'AlterDigifranchiseTable1708523142269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "Description" character varying(1000)`);
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "ServicesOffered" character varying(1000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "ServicesOffered"`);
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "Description"`);
    }

}
