import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomersTable1727938587119 implements MigrationInterface {
    name = 'CreateCustomersTable1727938587119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_table" DROP CONSTRAINT "FK_consultation_table_ownedDigifranchise"`);
        await queryRunner.query(`CREATE TABLE "digifranchise_customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "phoneNumber" character varying, "password" character varying, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP, CONSTRAINT "PK_1972d27f0595a8915fefaf14b24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_customers_access_control" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" uuid NOT NULL, "digifranchiseId" uuid NOT NULL, "password" character varying, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP, CONSTRAINT "PK_ad5429f32cc9a00421a8a220090" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_481065189f21e163c70e1caa6a" ON "digifranchise_working_hours" ("ownedDigifranchise") `);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers_access_control" ADD CONSTRAINT "FK_363b45febb123ddac08e15145b1" FOREIGN KEY ("customerId") REFERENCES "digifranchise_customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers_access_control" ADD CONSTRAINT "FK_8237cf19aae6751c9a05bfd943b" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ADD CONSTRAINT "FK_f67ef7b57cf158bdbd6da2ad380" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_table" DROP CONSTRAINT "FK_f67ef7b57cf158bdbd6da2ad380"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers_access_control" DROP CONSTRAINT "FK_8237cf19aae6751c9a05bfd943b"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers_access_control" DROP CONSTRAINT "FK_363b45febb123ddac08e15145b1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_481065189f21e163c70e1caa6a"`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "digifranchise_customers_access_control"`);
        await queryRunner.query(`DROP TABLE "digifranchise_customers"`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ADD CONSTRAINT "FK_consultation_table_ownedDigifranchise" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
