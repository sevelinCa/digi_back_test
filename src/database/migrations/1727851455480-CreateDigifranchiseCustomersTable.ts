import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDigifranchiseCustomersTable1727851455480 implements MigrationInterface {
    name = 'CreateDigifranchiseCustomersTable1727851455480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "digifranchise_customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "phoneNumber" character varying, "customerId" uuid NOT NULL, "digifranchiseId" uuid NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP, CONSTRAINT "PK_1972d27f0595a8915fefaf14b24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" ADD CONSTRAINT "FK_f683dd6938c9058a269f705f5f7" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" ADD CONSTRAINT "FK_e4ebfdcaf4d6d31503146b3c922" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" DROP CONSTRAINT "FK_e4ebfdcaf4d6d31503146b3c922"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" DROP CONSTRAINT "FK_f683dd6938c9058a269f705f5f7"`);
        await queryRunner.query(`DROP TABLE "digifranchise_customers"`);
    }

}
