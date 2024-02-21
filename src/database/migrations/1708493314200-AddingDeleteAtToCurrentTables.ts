import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingDeleteAtToCurrentTables1708493314200 implements MigrationInterface {
    name = 'AddingDeleteAtToCurrentTables1708493314200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "asset" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "income" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "funding" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "fixed_expense_category" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "deleteAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "fixed_expense_category" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "funding" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "income" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "deleteAt"`);
    }

}
