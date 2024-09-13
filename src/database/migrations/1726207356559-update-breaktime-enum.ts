import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBreaktimeEnum1726207356559 implements MigrationInterface {
    name = 'UpdateBreaktimeEnum1726207356559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum" RENAME TO "digifranchise_working_hours_breaktimebetweenbookedslots_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum" AS ENUM('15', '30', '60', '90')`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "breakTimeBetweenBookedSlots" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "breakTimeBetweenBookedSlots" TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum" USING "breakTimeBetweenBookedSlots"::"text"::"public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "breakTimeBetweenBookedSlots" SET DEFAULT '15'`);
        await queryRunner.query(`DROP TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum_old" AS ENUM('15', '30', '60')`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "breakTimeBetweenBookedSlots" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "breakTimeBetweenBookedSlots" TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum_old" USING "breakTimeBetweenBookedSlots"::"text"::"public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum_old"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ALTER COLUMN "breakTimeBetweenBookedSlots" SET DEFAULT '15'`);
        await queryRunner.query(`DROP TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."digifranchise_working_hours_breaktimebetweenbookedslots_enum_old" RENAME TO "digifranchise_working_hours_breaktimebetweenbookedslots_enum"`);
    }

}
