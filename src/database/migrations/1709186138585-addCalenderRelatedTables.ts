import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCalenderRelatedTables1709186138585 implements MigrationInterface {
    name = 'AddCalenderRelatedTables1709186138585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "calender_venue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "location" text NOT NULL, "capacity" integer, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_bf6e344b68f535c9a814a78b4a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calender_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "venueId" uuid, CONSTRAINT "PK_1f6cd347cfa262cd2593bf004a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calender_event_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "eventId" uuid, "userId" uuid, CONSTRAINT "PK_dd664736ef1e94ecb58038f6b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calender_booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying(50) NOT NULL, "attendees" integer, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "eventId" uuid, "userId" uuid, CONSTRAINT "PK_ab794679a4d959865df1e4fe633" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "calender_events" ADD CONSTRAINT "FK_8dcf9df603d9c9518fcff8b2c97" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calender_events" ADD CONSTRAINT "FK_31fe3b9d74c21abf76543517a5b" FOREIGN KEY ("venueId") REFERENCES "calender_venue"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calender_event_owner" ADD CONSTRAINT "FK_3b743b740c6fc7d9a878068b35b" FOREIGN KEY ("eventId") REFERENCES "calender_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calender_event_owner" ADD CONSTRAINT "FK_8603f0c977af720afb503d38a3e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calender_booking" ADD CONSTRAINT "FK_309e58e3659640e2ceae92be3c8" FOREIGN KEY ("eventId") REFERENCES "calender_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calender_booking" ADD CONSTRAINT "FK_e095452ab2941b5b87858e39648" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calender_booking" DROP CONSTRAINT "FK_e095452ab2941b5b87858e39648"`);
        await queryRunner.query(`ALTER TABLE "calender_booking" DROP CONSTRAINT "FK_309e58e3659640e2ceae92be3c8"`);
        await queryRunner.query(`ALTER TABLE "calender_event_owner" DROP CONSTRAINT "FK_8603f0c977af720afb503d38a3e"`);
        await queryRunner.query(`ALTER TABLE "calender_event_owner" DROP CONSTRAINT "FK_3b743b740c6fc7d9a878068b35b"`);
        await queryRunner.query(`ALTER TABLE "calender_events" DROP CONSTRAINT "FK_31fe3b9d74c21abf76543517a5b"`);
        await queryRunner.query(`ALTER TABLE "calender_events" DROP CONSTRAINT "FK_8dcf9df603d9c9518fcff8b2c97"`);
        await queryRunner.query(`DROP TABLE "calender_booking"`);
        await queryRunner.query(`DROP TABLE "calender_event_owner"`);
        await queryRunner.query(`DROP TABLE "calender_events"`);
        await queryRunner.query(`DROP TABLE "calender_venue"`);
    }

}
