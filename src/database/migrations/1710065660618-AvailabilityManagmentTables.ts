import { MigrationInterface, QueryRunner } from "typeorm";

export class AvailabilityManagmentTables1710065660618
  implements MigrationInterface
{
  name = "AvailabilityManagmentTables1710065660618";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."available_management_allowedtimeslotunits_enum" AS ENUM('15', '30', '60', '90')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."available_management_mintimebetweenbookedslots_enum" AS ENUM('15', '30', '60')`,
    );
    await queryRunner.query(
      `CREATE TABLE "available_management" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "weekDaysAndTimes" json NOT NULL, "allowedTimeSlotUnits" "public"."available_management_allowedtimeslotunits_enum" NOT NULL DEFAULT '30', "minTimeBetweenBookedSlots" "public"."available_management_mintimebetweenbookedslots_enum" NOT NULL DEFAULT '15', "allowBookingOnPublicHolidays" boolean NOT NULL DEFAULT false, "unavailableTime" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "digifranchiseId" uuid, CONSTRAINT "PK_6076db187aa80e2f90c870ea536" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "unavailable_management" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unavailableTime" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "digifranchiseId" uuid, "AvailableManagementId" uuid, CONSTRAINT "PK_00cc3c7d613160a9487b89170ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" ADD CONSTRAINT "FK_faa4f1caf364e05551ae79b94e1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" ADD CONSTRAINT "FK_2841c15d677aa9b3cc96784028a" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" ADD CONSTRAINT "FK_275edb612f04767efbb286ce63f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" ADD CONSTRAINT "FK_87f741f438c6e5f9d38f6c01285" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" ADD CONSTRAINT "FK_9dbf38c49944741370eabe3e2d5" FOREIGN KEY ("AvailableManagementId") REFERENCES "available_management"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" DROP CONSTRAINT "FK_9dbf38c49944741370eabe3e2d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" DROP CONSTRAINT "FK_87f741f438c6e5f9d38f6c01285"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" DROP CONSTRAINT "FK_275edb612f04767efbb286ce63f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" DROP CONSTRAINT "FK_2841c15d677aa9b3cc96784028a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" DROP CONSTRAINT "FK_faa4f1caf364e05551ae79b94e1"`,
    );
    await queryRunner.query(`DROP TABLE "unavailable_management"`);
    await queryRunner.query(`DROP TABLE "available_management"`);
    await queryRunner.query(
      `DROP TYPE "public"."available_management_mintimebetweenbookedslots_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."available_management_allowedtimeslotunits_enum"`,
    );
  }
}
