import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateWorkingHours1714298450571 implements MigrationInterface {
  name = "GenerateWorkingHours1714298450571";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum" AS ENUM('15', '30', '60', '90')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum" AS ENUM('15', '30', '60')`,
    );
    await queryRunner.query(
      `CREATE TABLE "digifranchise_working_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "allowedTimeSlotUnits" "public"."digifranchise_working_hours_allowedtimeslotunits_enum" NOT NULL DEFAULT '30', "breakTimeBetweenBookedSlots" "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum" NOT NULL DEFAULT '15', "allowBookingOnPublicHolidays" boolean NOT NULL DEFAULT false, "workingDays" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchise" uuid, CONSTRAINT "PK_f9584ef98adc86fa7e32fbf6af7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" ADD CONSTRAINT "FK_481065189f21e163c70e1caa6a7" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" DROP CONSTRAINT "FK_481065189f21e163c70e1caa6a7"`,
    );
    await queryRunner.query(`DROP TABLE "digifranchise_working_hours"`);
    await queryRunner.query(
      `DROP TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum"`,
    );
  }
}
