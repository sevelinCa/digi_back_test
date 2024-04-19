import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNewAvailabilityTables1713505869397 implements MigrationInterface {
    name = 'UpdateNewAvailabilityTables1713505869397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_26f8d09fb0e3050edee784e048d"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_ad463fc48e73d7176f9b6954ee0"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`CREATE TABLE "availability_slots_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isSlotBooked" boolean NOT NULL DEFAULT false, "availabilityTimeSlotsDetails" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "availabilityDayTime" uuid, "availabilityWeekDays" uuid, "ownedDigifranchise" uuid, CONSTRAINT "PK_76739667fc3e9b922c625c41ae9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "allowedTimeSlotUnits"`);
        await queryRunner.query(`DROP TYPE "public"."unavailability_allowedtimeslotunits_enum"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "breakTimeBetweenBookedSlots"`);
        await queryRunner.query(`DROP TYPE "public"."unavailability_breaktimebetweenbookedslots_enum"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "weekDays"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "allowBookingOnPublicHolidays"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "dayTime"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "availability_week_days" ADD "workingDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "availability_week_days" ADD "unavailabilityId" uuid`);
        await queryRunner.query(`ALTER TABLE "availability_week_days" ADD "availabilitySlotsDetailsId" uuid`);
        await queryRunner.query(`ALTER TABLE "availability_day_time" ADD "availabilitySlotsDetailsId" uuid`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "unavailabilityId" uuid`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "startTime" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "endTime" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "availabilityWeekDays" uuid`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "Availability" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_0f4d0bb222d42ea6efc5b5085ae" FOREIGN KEY ("unavailabilityId") REFERENCES "unavailability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_8c1df98ed8d874f9284a3101ea0" FOREIGN KEY ("availabilitySlotsDetailsId") REFERENCES "availability_slots_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_ae2d7e60007de6eca161274a97a" FOREIGN KEY ("availabilitySlotsDetailsId") REFERENCES "availability_slots_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_9480c148c8c362a973f97a5206a" FOREIGN KEY ("unavailabilityId") REFERENCES "unavailability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_c42e3051c0b3c98b039c8858064" FOREIGN KEY ("availabilityWeekDays") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_62ebe6fe6b900ab79fe8e529510" FOREIGN KEY ("Availability") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_c2b553ce6ea8024db0c0ebd76bc" FOREIGN KEY ("availabilityDayTime") REFERENCES "availability_day_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_37207487c424dc59d9f0de59db5" FOREIGN KEY ("availabilityWeekDays") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_f8b867f7eb949923c2797c99a26" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_f8b867f7eb949923c2797c99a26"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_37207487c424dc59d9f0de59db5"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_c2b553ce6ea8024db0c0ebd76bc"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_62ebe6fe6b900ab79fe8e529510"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_c42e3051c0b3c98b039c8858064"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_9480c148c8c362a973f97a5206a"`);
        await queryRunner.query(`ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_ae2d7e60007de6eca161274a97a"`);
        await queryRunner.query(`ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_8c1df98ed8d874f9284a3101ea0"`);
        await queryRunner.query(`ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_0f4d0bb222d42ea6efc5b5085ae"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "Availability"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "availabilityWeekDays"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "unavailabilityId"`);
        await queryRunner.query(`ALTER TABLE "availability_day_time" DROP COLUMN "availabilitySlotsDetailsId"`);
        await queryRunner.query(`ALTER TABLE "availability_week_days" DROP COLUMN "availabilitySlotsDetailsId"`);
        await queryRunner.query(`ALTER TABLE "availability_week_days" DROP COLUMN "unavailabilityId"`);
        await queryRunner.query(`ALTER TABLE "availability_week_days" DROP COLUMN "workingDate"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "dayTime" uuid`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "allowBookingOnPublicHolidays" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "weekDays" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."unavailability_breaktimebetweenbookedslots_enum" AS ENUM('15', '30', '60')`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "breakTimeBetweenBookedSlots" "public"."unavailability_breaktimebetweenbookedslots_enum" NOT NULL DEFAULT '15'`);
        await queryRunner.query(`CREATE TYPE "public"."unavailability_allowedtimeslotunits_enum" AS ENUM('15', '30', '60', '90')`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "allowedTimeSlotUnits" "public"."unavailability_allowedtimeslotunits_enum" NOT NULL DEFAULT '30'`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`DROP TABLE "availability_slots_details"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_ad463fc48e73d7176f9b6954ee0" FOREIGN KEY ("weekDays") REFERENCES "unavailability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_26f8d09fb0e3050edee784e048d" FOREIGN KEY ("dayTime") REFERENCES "unavailability_day_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
