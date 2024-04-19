import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAvailabilitySlotDetailsTables1713567724075 implements MigrationInterface {
    name = 'UpdateAvailabilitySlotDetailsTables1713567724075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "availability_slots_details" ADD "day" character varying(255)`);
        await queryRunner.query(`UPDATE "availability_slots_details" SET "day" = 'default_value' WHERE "day" IS NULL`);

        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" ADD "workingDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" ALTER COLUMN "day" SET NOT NULL`);        await queryRunner.query(`ALTER TABLE "availability_slots_details" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_28087b30bb38e9716c87bab7a71" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "availability_slots_details" ALTER COLUMN "day" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" DROP COLUMN "day"`);
        
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_28087b30bb38e9716c87bab7a71"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" DROP COLUMN "day"`);
        await queryRunner.query(`ALTER TABLE "availability_slots_details" DROP COLUMN "workingDate"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
