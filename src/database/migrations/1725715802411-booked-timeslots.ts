import { MigrationInterface, QueryRunner } from "typeorm";

export class BookedTimeslots1725715802411 implements MigrationInterface {
    name = 'BookedTimeslots1725715802411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "booked_timeslots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workingDate" TIMESTAMP, "day" character varying(255) NOT NULL, "startTime" character varying(255) NOT NULL, "endTime" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchise" uuid, CONSTRAINT "PK_397ee3eab09560243285f98d449" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booked_timeslots" ADD CONSTRAINT "FK_4d042357710872defe2f512fa57" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booked_timeslots" DROP CONSTRAINT "FK_4d042357710872defe2f512fa57"`);
        await queryRunner.query(`DROP TABLE "booked_timeslots"`);
    }

}
