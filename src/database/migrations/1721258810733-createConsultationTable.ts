import { MigrationInterface, QueryRunner } from "typeorm";

export class ConsultationsTable1721258810733 implements MigrationInterface {
  name = "ConsultationsTable1721258810733";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "consultation_table" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "ownedDigifranchise" uuid,
        "additionalInfo" varchar,
        "bookedTimeSlots" json,
        "contactInfo" json NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleteAt" TIMESTAMP,
        CONSTRAINT "PK_consultation_table_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "consultation_table"
      ADD CONSTRAINT "FK_consultation_table_ownedDigifranchise" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "consultation_table" DROP CONSTRAINT "FK_consultation_table_ownedDigifranchise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "consultation_table"`);
  }
}
