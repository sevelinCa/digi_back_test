import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAssociationsInNewAvailbalityTables1713737090309 implements MigrationInterface {
    name = 'FixAssociationsInNewAvailbalityTables1713737090309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_9480c148c8c362a973f97a5206a"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_32511c4e6017df3ba2925f9f059"`);
        await queryRunner.query(`ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_05143a6e2e904386c51c5360e8f"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_62ebe6fe6b900ab79fe8e529510"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_c42e3051c0b3c98b039c8858064"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "availability_day_time" RENAME COLUMN "availability" TO "availabilityId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "dayTime"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "unavailabilityId"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "Availability"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "availabilityWeekDays"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "availabilityWeekDaysId" uuid`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "availabilityId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_1d30ef0b45d4439abf2f979a812" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_69da644f9ad6db633ec12577f59" FOREIGN KEY ("availabilityWeekDaysId") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_614e5860cbaab23cdf0fbd6b89c" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_614e5860cbaab23cdf0fbd6b89c"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP CONSTRAINT "FK_69da644f9ad6db633ec12577f59"`);
        await queryRunner.query(`ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_1d30ef0b45d4439abf2f979a812"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "availabilityId"`);
        await queryRunner.query(`ALTER TABLE "unavailability" DROP COLUMN "availabilityWeekDaysId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "availabilityWeekDays" uuid`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD "Availability" uuid`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "unavailabilityId" uuid`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "dayTime" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "availability_day_time" RENAME COLUMN "availabilityId" TO "availability"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_c42e3051c0b3c98b039c8858064" FOREIGN KEY ("availabilityWeekDays") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailability" ADD CONSTRAINT "FK_62ebe6fe6b900ab79fe8e529510" FOREIGN KEY ("Availability") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_05143a6e2e904386c51c5360e8f" FOREIGN KEY ("availability") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_32511c4e6017df3ba2925f9f059" FOREIGN KEY ("dayTime") REFERENCES "availability_day_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_9480c148c8c362a973f97a5206a" FOREIGN KEY ("unavailabilityId") REFERENCES "unavailability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
