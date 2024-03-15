import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCalenderTable1710501360066 implements MigrationInterface {
    name = 'FixCalenderTable1710501360066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calender_events" RENAME COLUMN "eventDate" TO "description"`);
        await queryRunner.query(`CREATE TABLE "calender_event_guest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "customerId" uuid, "eventId" uuid, CONSTRAINT "PK_4db8f464545f64578e87f22e18c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "calender_events" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "calender_events" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "calender_event_guest" ADD CONSTRAINT "FK_3f8676d72b00c305f1742696a4c" FOREIGN KEY ("customerId") REFERENCES "customer_management"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calender_event_guest" ADD CONSTRAINT "FK_191f99a2329d5b373c99aa15acf" FOREIGN KEY ("eventId") REFERENCES "calender_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calender_event_guest" DROP CONSTRAINT "FK_191f99a2329d5b373c99aa15acf"`);
        await queryRunner.query(`ALTER TABLE "calender_event_guest" DROP CONSTRAINT "FK_3f8676d72b00c305f1742696a4c"`);
        await queryRunner.query(`ALTER TABLE "calender_events" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "calender_events" ADD "description" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "calender_event_guest"`);
        await queryRunner.query(`ALTER TABLE "calender_events" RENAME COLUMN "description" TO "eventDate"`);
    }

}
