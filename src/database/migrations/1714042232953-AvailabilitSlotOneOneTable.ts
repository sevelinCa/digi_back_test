import { MigrationInterface, QueryRunner } from "typeorm";

export class AvailabilitSlotOneOneTable1714042232953 implements MigrationInterface {
    name = 'AvailabilitSlotOneOneTable1714042232953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Handle null values in userEmail column
        await queryRunner.query(`UPDATE "digifranchise_owner" SET "userEmail" = '' WHERE "userEmail" IS NULL`);

        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`CREATE TABLE "availability_slots_time_one_one" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isSlotBooked" boolean NOT NULL DEFAULT false, "singleAvailabilityTimeSlots" json, "workingDate" TIMESTAMP, "day" character varying(255) NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "availabilityDayTime" uuid, "availabilityWeekDays" uuid, "ownedDigifranchise" uuid, "availabilityId" uuid, "bookedSlotsId" uuid, CONSTRAINT "PK_d1882549935795f21647282b601" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owner" ALTER COLUMN "userEmail" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owner" ALTER COLUMN "userEmail" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_45762ce41e7b96dc7853810b7d6" FOREIGN KEY ("availabilityDayTime") REFERENCES "availability_day_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_5f874121cc3db70869721cbec08" FOREIGN KEY ("availabilityWeekDays") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_9136759e57e7557937afdfa3075" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_c55830852b43c72edaa1c87ef5d" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_95203188a50d5e89629c446c6c0" FOREIGN KEY ("bookedSlotsId") REFERENCES "availability_booked_slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_95203188a50d5e89629c446c6c0"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_c55830852b43c72edaa1c87ef5d"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_9136759e57e7557937afdfa3075"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_5f874121cc3db70869721cbec08"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_45762ce41e7b96dc7853810b7d6"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owner" ALTER COLUMN "userEmail" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owner" ALTER COLUMN "userEmail" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`DROP TABLE "availability_slots_time_one_one"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
