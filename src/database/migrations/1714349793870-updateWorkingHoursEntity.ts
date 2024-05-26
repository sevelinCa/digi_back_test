import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWorkingHoursEntity1714349793870
  implements MigrationInterface
{
  name = "UpdateWorkingHoursEntity1714349793870";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" DROP COLUMN "workingDays"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" ADD "availabilityWeekDays" json`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" ADD "unavailability" json`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" DROP COLUMN "unavailability"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" DROP COLUMN "availabilityWeekDays"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" ADD "workingDays" json`,
    );
  }
}
