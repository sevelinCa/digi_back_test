import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFreeConsultation1728539293579 implements MigrationInterface {
    name = 'AddFreeConsultation1728539293579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ADD "freeConsulations" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" DROP COLUMN "freeConsulations"`);
    }

}
