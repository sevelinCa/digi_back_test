import { MigrationInterface, QueryRunner } from "typeorm";

export class UseEnumOnStatusBookingTable1709223693577
  implements MigrationInterface
{
  name = "UseEnumOnStatusBookingTable1709223693577";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "calender_booking" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."calender_booking_status_enum" AS ENUM('confirmed', 'pending', 'cancelled', 'rescheduled', 'no_show', 'completed', 'in_progress')`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_booking" ADD "status" "public"."calender_booking_status_enum" NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "calender_booking" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."calender_booking_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_booking" ADD "status" character varying(50) NOT NULL`,
    );
  }
}
