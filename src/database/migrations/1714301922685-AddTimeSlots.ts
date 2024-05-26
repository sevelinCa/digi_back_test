import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimeSlots1714301922685 implements MigrationInterface {
  name = "AddTimeSlots1714301922685";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "availability_time_slots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isSlotBooked" boolean NOT NULL DEFAULT false, "isSlotAvailable" boolean NOT NULL DEFAULT true, "workingDate" TIMESTAMP, "day" character varying(255) NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchise" uuid, CONSTRAINT "PK_054bcc5544631a8dc3641f31658" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_time_slots" ADD CONSTRAINT "FK_0bb10729628acb8766a41785e37" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "availability_time_slots" DROP CONSTRAINT "FK_0bb10729628acb8766a41785e37"`,
    );
    await queryRunner.query(`DROP TABLE "availability_time_slots"`);
  }
}
