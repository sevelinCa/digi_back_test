import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAllowedtimeslotunitEnum1726135999908 implements MigrationInterface {
    name = 'UpdateAllowedtimeslotunitEnum1726135999908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booked_timeslots" DROP CONSTRAINT "FK_4d042357710872defe2f512fa57"`);
        await queryRunner.query(`ALTER TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum" RENAME TO "digifranchise_working_hours_allowedtimeslotunits_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum" AS ENUM('15', '30', '60', '90', '120')`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "allowedTimeSlotUnits" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "allowedTimeSlotUnits" TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum" USING "allowedTimeSlotUnits"::"text"::"public"."digifranchise_working_hours_allowedtimeslotunits_enum"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "allowedTimeSlotUnits" SET DEFAULT '30'`);
        await queryRunner.query(`DROP TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum_old"`);
        await queryRunner.query(`ALTER TABLE "booked_timeslots" ADD CONSTRAINT "FK_315856d1a630fd5f6c16037b09c" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booked_timeslots" DROP CONSTRAINT "FK_315856d1a630fd5f6c16037b09c"`);
        await queryRunner.query(`CREATE TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum_old" AS ENUM('15', '30', '60', '90')`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "allowedTimeSlotUnits" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "allowedTimeSlotUnits" TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum_old" USING "allowedTimeSlotUnits"::"text"::"public"."digifranchise_working_hours_allowedtimeslotunits_enum_old"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "allowedTimeSlotUnits" SET DEFAULT '30'`);
        await queryRunner.query(`DROP TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum_old" RENAME TO "digifranchise_working_hours_allowedtimeslotunits_enum"`);
        await queryRunner.query(`ALTER TABLE "booked_timeslots" ADD CONSTRAINT "FK_4d042357710872defe2f512fa57" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
