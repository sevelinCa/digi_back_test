import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatingIncome1708511567407 implements MigrationInterface {
    name = 'UpdatingIncome1708511567407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "dateReceived"`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "dateReceived" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "dateReceived"`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "dateReceived" date NOT NULL`);
    }

}
