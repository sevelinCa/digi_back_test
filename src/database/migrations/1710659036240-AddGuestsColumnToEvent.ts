import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGuestsColumnToEvent1710659036240 implements MigrationInterface {
    name = 'AddGuestsColumnToEvent1710659036240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calender_events" RENAME COLUMN "eventDate" TO "description"`);
        await queryRunner.query(`ALTER TABLE "calender_events" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "calender_events" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calender_events" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "calender_events" ADD "description" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "calender_events" RENAME COLUMN "description" TO "eventDate"`);
    }

}
