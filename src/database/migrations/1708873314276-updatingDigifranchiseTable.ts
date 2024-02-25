import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatingDigifranchiseTable1708873314276 implements MigrationInterface {
    name = 'UpdatingDigifranchiseTable1708873314276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" ALTER COLUMN "status" SET DEFAULT '2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
    }

}
