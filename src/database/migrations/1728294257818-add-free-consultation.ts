import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFreeConsultation1728294257818 implements MigrationInterface {
    name = 'AddFreeConsultation1728294257818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_table" DROP CONSTRAINT "FK_consultation_table_ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" ADD "freeConsulations" json`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_481065189f21e163c70e1caa6a" ON "digifranchise_working_hours" ("ownedDigifranchise") `);
        await queryRunner.query(`ALTER TABLE "consultation_table" ADD CONSTRAINT "FK_f67ef7b57cf158bdbd6da2ad380" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_table" DROP CONSTRAINT "FK_f67ef7b57cf158bdbd6da2ad380"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_481065189f21e163c70e1caa6a"`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "digifranchise_working_hours" DROP COLUMN "freeConsulations"`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ADD CONSTRAINT "FK_consultation_table_ownedDigifranchise" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
