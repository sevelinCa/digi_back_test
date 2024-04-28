import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateCalendarEntity1714134316304 implements MigrationInterface {
    name = 'GenerateCalendarEntity1714134316304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`CREATE TABLE "digifranchise_unavailable_times" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workingDate" TIMESTAMP, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchise" uuid, CONSTRAINT "PK_04b2b45771181500a7ccc167967" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "availability_time_slots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isSlotBooked" boolean NOT NULL DEFAULT false, "isSlotAvailable" boolean NOT NULL DEFAULT true, "workingDate" TIMESTAMP, "day" character varying(255) NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchise" uuid, CONSTRAINT "PK_054bcc5544631a8dc3641f31658" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum" AS ENUM('15', '30', '60', '90')`);
        await queryRunner.query(`CREATE TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum" AS ENUM('15', '30', '60')`);
        await queryRunner.query(`CREATE TABLE "digifranchise_working_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "allowedTimeSlotUnits" "public"."digifranchise_working_hours_allowedtimeslotunits_enum" NOT NULL DEFAULT '30', "breakTimeBetweenBookedSlots" "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum" NOT NULL DEFAULT '15', "allowBookingOnPublicHolidays" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchise" uuid, CONSTRAINT "PK_f9584ef98adc86fa7e32fbf6af7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "availability_booked_slots" ADD CONSTRAINT "FK_89b14ce607290844cbfb4daa20a" FOREIGN KEY ("slotId") REFERENCES "availability_slots_time_one_one"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_unavailable_times" ADD CONSTRAINT "FK_50f78839ab09ac9e7e03f566bac" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_time_slots" ADD CONSTRAINT "FK_0bb10729628acb8766a41785e37" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ADD CONSTRAINT "FK_481065189f21e163c70e1caa6a7" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" DROP CONSTRAINT "FK_481065189f21e163c70e1caa6a7"`);
        await queryRunner.query(`ALTER TABLE "availability_time_slots" DROP CONSTRAINT "FK_0bb10729628acb8766a41785e37"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_unavailable_times" DROP CONSTRAINT "FK_50f78839ab09ac9e7e03f566bac"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        // await queryRunner.query(`ALTER TABLE "availability_booked_slots" DROP CONSTRAINT "FK_89b14ce607290844cbfb4daa20a"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`DROP TABLE "digifranchise_working_hours"`);
        await queryRunner.query(`DROP TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum"`);
        await queryRunner.query(`DROP TYPE "public"."digifranchise_working_hours_allowedtimeslotunits_enum"`);
        await queryRunner.query(`DROP TABLE "availability_time_slots"`);
        await queryRunner.query(`DROP TABLE "digifranchise_unavailable_times"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
