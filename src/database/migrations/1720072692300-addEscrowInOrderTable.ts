import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEscrowInOrderTable1720072692300 implements MigrationInterface {
    name = 'AddEscrowInOrderTable1720072692300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_table" ADD "useEscrow" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_table" DROP COLUMN "useEscrow"`);
    }

}
