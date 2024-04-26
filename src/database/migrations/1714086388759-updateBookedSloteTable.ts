import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookedSloteTable1714086388759 implements MigrationInterface {
    name = 'UpdateBookedSloteTable1714086388759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT IF EXISTS "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT IF EXISTS "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN IF EXISTS "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN IF EXISTS "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Check if the constraint exists before adding it
        // await queryRunner.query(`
        //     DO $$ BEGIN
        //         IF NOT EXISTS (
        //             SELECT 1
        //             FROM   information_schema.table_constraints 
        //             WHERE constraint_name = 'FK_89b14ce607290844cbfb4daa20a'
        //             ) THEN
        //             ALTER TABLE "availability_booked_slots" ADD CONSTRAINT "FK_89b14ce607290844cbfb4daa20a" FOREIGN KEY ("slotId") REFERENCES "availability_slots_time_one_one"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        //         END IF;
        //     END $$;
        // `);

        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT IF EXISTS "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "availability_booked_slots" DROP CONSTRAINT IF EXISTS "FK_89b14ce607290844cbfb4daa20a"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT IF EXISTS "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN IF EXISTS "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN IF EXISTS "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}