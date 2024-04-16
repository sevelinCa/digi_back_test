import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatingNewAvailabilityTables1713284951065 implements MigrationInterface {
    name = 'CreatingNewAvailabilityTables1713284951065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`CREATE TABLE "availability_week_days" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" character varying(255) NOT NULL, "isDayFullBooked" boolean NOT NULL DEFAULT false, "availabilityCounts" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_598829a14e3e7bde460195fb0a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "availability_day_time" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "isBooked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_2425a3a697cb9750d6d520e59d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."availability_allowedtimeslotunits_enum" AS ENUM('15', '30', '60', '90')`);
        await queryRunner.query(`CREATE TYPE "public"."availability_breaktimebetweenbookedslots_enum" AS ENUM('15', '30', '60')`);
        await queryRunner.query(`CREATE TABLE "availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "allowedTimeSlotUnits" "public"."availability_allowedtimeslotunits_enum" NOT NULL DEFAULT '30', "breakTimeBetweenBookedSlots" "public"."availability_breaktimebetweenbookedslots_enum" NOT NULL DEFAULT '15', "allowBookingOnPublicHolidays" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "ownedDigifranchise" uuid, "weekDays" uuid, "dayTime" uuid, CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "unavailability_week_days" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" character varying(255) NOT NULL, "isDayFullBooked" boolean NOT NULL DEFAULT false, "availabilityCounts" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_627feb94b6e5d2aa29818b9fb5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "unavailability_day_time" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "isBooked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_1693c4f0a0d7ff1be71385872a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."unavailability_allowedtimeslotunits_enum" AS ENUM('15', '30', '60', '90')`);
        await queryRunner.query(`CREATE TYPE "public"."unavailability_breaktimebetweenbookedslots_enum" AS ENUM('15', '30', '60')`);
        await queryRunner.query(`CREATE TABLE "unavailability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "allowedTimeSlotUnits" "public"."unavailability_allowedtimeslotunits_enum" NOT NULL DEFAULT '30', "breakTimeBetweenBookedSlots" "public"."unavailability_breaktimebetweenbookedslots_enum" NOT NULL DEFAULT '15', "allowBookingOnPublicHolidays" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "ownedDigifranchise" uuid, "weekDays" uuid, "dayTime" uuid, CONSTRAINT "PK_176e6b52ee1b44acea3b66e8aac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_569b66bac409918e56b48ccb3dd" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_3a757c01063e9d0a5130be62316" FOREIGN KEY ("weekDays") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_32511c4e6017df3ba2925f9f059" FOREIGN KEY ("dayTime") REFERENCES "availability_day_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_e21814e44acef02ccba5977885f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_392835dc095933a11e48fe99901" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_ad463fc48e73d7176f9b6954ee0" FOREIGN KEY ("weekDays") REFERENCES "unavailability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_26f8d09fb0e3050edee784e048d" FOREIGN KEY ("dayTime") REFERENCES "unavailability_day_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_26f8d09fb0e3050edee784e048d"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_ad463fc48e73d7176f9b6954ee0"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_392835dc095933a11e48fe99901"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_e21814e44acef02ccba5977885f"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_32511c4e6017df3ba2925f9f059"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_3a757c01063e9d0a5130be62316"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_569b66bac409918e56b48ccb3dd"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`DROP TABLE "unavailability"`);
        await queryRunner.query(`DROP TYPE "public"."unavailability_breaktimebetweenbookedslots_enum"`);
        await queryRunner.query(`DROP TYPE "public"."unavailability_allowedtimeslotunits_enum"`);
        await queryRunner.query(`DROP TABLE "unavailability_day_time"`);
        await queryRunner.query(`DROP TABLE "unavailability_week_days"`);
        await queryRunner.query(`DROP TABLE "availability"`);
        await queryRunner.query(`DROP TYPE "public"."availability_breaktimebetweenbookedslots_enum"`);
        await queryRunner.query(`DROP TYPE "public"."availability_allowedtimeslotunits_enum"`);
        await queryRunner.query(`DROP TABLE "availability_day_time"`);
        await queryRunner.query(`DROP TABLE "availability_week_days"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
