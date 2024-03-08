import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFileEntity1709873980645 implements MigrationInterface {
    name = 'UpdateFileEntity1709873980645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "file" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "file" ADD "deleteAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "createdAt"`);
    }

}
