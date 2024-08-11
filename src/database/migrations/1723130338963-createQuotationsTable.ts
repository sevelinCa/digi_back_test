import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuotationsTable1723130338963 implements MigrationInterface {
    name = 'CreateQuotationsTable1723130338963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_table" DROP CONSTRAINT "FK_consultation_table_ownedDigifranchise"`);
        await queryRunner.query(`CREATE TABLE "quotations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "digifranchiseUrl" character varying(255) NOT NULL, "isOrdered" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownedDigifranchiseId" uuid, CONSTRAINT "PK_6c00eb8ba181f28c21ffba7ecb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quotationItems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "price" numeric NOT NULL, "expiryDate" TIMESTAMP, "provisionHours" TIMESTAMP, "quotation" uuid, "product" uuid, "service" uuid, CONSTRAINT "PK_1a09ce43bf32ebe029cf45a5760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quotations" ADD CONSTRAINT "FK_1e5666c02e55fcd05929281b3c0" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotationItems" ADD CONSTRAINT "FK_c4e72ddcc79948854d899c6d921" FOREIGN KEY ("quotation") REFERENCES "quotations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotationItems" ADD CONSTRAINT "FK_893b14ad6d727b295916c0924bb" FOREIGN KEY ("product") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotationItems" ADD CONSTRAINT "FK_ed98d75f79f2f3753c1812bd1c3" FOREIGN KEY ("service") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ADD CONSTRAINT "FK_f67ef7b57cf158bdbd6da2ad380" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_table" DROP CONSTRAINT "FK_f67ef7b57cf158bdbd6da2ad380"`);
        await queryRunner.query(`ALTER TABLE "quotationItems" DROP CONSTRAINT "FK_ed98d75f79f2f3753c1812bd1c3"`);
        await queryRunner.query(`ALTER TABLE "quotationItems" DROP CONSTRAINT "FK_893b14ad6d727b295916c0924bb"`);
        await queryRunner.query(`ALTER TABLE "quotationItems" DROP CONSTRAINT "FK_c4e72ddcc79948854d899c6d921"`);
        await queryRunner.query(`ALTER TABLE "quotations" DROP CONSTRAINT "FK_1e5666c02e55fcd05929281b3c0"`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "quotationItems"`);
        await queryRunner.query(`DROP TABLE "quotations"`);
        await queryRunner.query(`ALTER TABLE "consultation_table" ADD CONSTRAINT "FK_consultation_table_ownedDigifranchise" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
