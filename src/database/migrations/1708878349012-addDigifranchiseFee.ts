import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDigifranchiseFee1708878349012 implements MigrationInterface {
    name = 'AddDigifranchiseFee1708878349012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "digifranchiseFee" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "digifranchiseFee"`);
    }

}
