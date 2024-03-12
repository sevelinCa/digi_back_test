import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlToFileEntity1710260926140 implements MigrationInterface {
    name = 'AddUrlToFileEntity1710260926140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD "url" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "url"`);
    }

}
