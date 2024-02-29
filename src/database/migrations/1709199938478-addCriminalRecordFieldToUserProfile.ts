import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCriminalRecordFieldToUserProfile1709199938478 implements MigrationInterface {
    name = 'AddCriminalRecordFieldToUserProfile1709199938478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "criminalRecord" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "criminalRecord"`);
    }

}
