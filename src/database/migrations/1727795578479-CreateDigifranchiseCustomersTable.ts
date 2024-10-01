import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDigifranchiseCustomersTable1727795578479 implements MigrationInterface {
    name = 'CreateDigifranchiseCustomersTable1727795578479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_table" DROP CONSTRAINT "FK_consultation_table_ownedDigifranchise"`);
        await queryRunner.query(`CREATE TABLE "digifranchise_customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP, "customerId" uuid, "digifranchiseId" uuid, CONSTRAINT "PK_1972d27f0595a8915fefaf14b24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_481065189f21e163c70e1caa6a" ON "digifranchise_working_hours" ("ownedDigifranchise") `);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" ADD CONSTRAINT "FK_f683dd6938c9058a269f705f5f7" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" ADD CONSTRAINT "FK_e4ebfdcaf4d6d31503146b3c922" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ADD CONSTRAINT "FK_f67ef7b57cf158bdbd6da2ad380" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_table" DROP CONSTRAINT "FK_f67ef7b57cf158bdbd6da2ad380"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" DROP CONSTRAINT "FK_e4ebfdcaf4d6d31503146b3c922"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" DROP CONSTRAINT "FK_f683dd6938c9058a269f705f5f7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_481065189f21e163c70e1caa6a"`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "digifranchise_customers"`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ADD CONSTRAINT "FK_consultation_table_ownedDigifranchise" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
