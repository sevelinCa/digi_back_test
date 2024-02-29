import { MigrationInterface, QueryRunner } from "typeorm";

export class EditUserProfile1709199166732 implements MigrationInterface {
    name = 'EditUserProfile1709199166732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "venue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "location" text NOT NULL, "capacity" integer, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_c53deb6d1bcb088f9d459e7dbc0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "venueId" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "eventId" uuid, "userId" uuid, CONSTRAINT "PK_36367b592f4185fd34f9a444075" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying(50) NOT NULL, "attendees" integer, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "eventId" uuid, "userId" uuid, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "southAfricanCitizen" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "documentId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "countryOfOrigin" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "policeClearenceCertificate" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "crimes" json`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_9929fa8516afa13f87b41abb263" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_0af7bb0535bc01f3c130cfe5fe7" FOREIGN KEY ("venueId") REFERENCES "venue"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_owner" ADD CONSTRAINT "FK_0daf227f3b8f8b5b9d3fc43435e" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_owner" ADD CONSTRAINT "FK_ddd923fcf2f5a682a512f2c73f6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_161ef84a823b75f741862a77138" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_161ef84a823b75f741862a77138"`);
        await queryRunner.query(`ALTER TABLE "event_owner" DROP CONSTRAINT "FK_ddd923fcf2f5a682a512f2c73f6"`);
        await queryRunner.query(`ALTER TABLE "event_owner" DROP CONSTRAINT "FK_0daf227f3b8f8b5b9d3fc43435e"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_0af7bb0535bc01f3c130cfe5fe7"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_9929fa8516afa13f87b41abb263"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "crimes"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "policeClearenceCertificate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "countryOfOrigin"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "documentId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "southAfricanCitizen"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TABLE "event_owner"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "venue"`);
    }

}
