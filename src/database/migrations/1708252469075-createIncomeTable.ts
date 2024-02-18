import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIncomeTable1708252469075 implements MigrationInterface {
    name = 'CreateIncomeTable1708252469075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "income" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying(255) NOT NULL, "quantity" integer NOT NULL, "unityCost" numeric(10,2) NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "description" character varying(255) NOT NULL, "incomeDate" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "franchiseId" uuid, CONSTRAINT "PK_29a10f17b97568f70cee8586d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03"`);
        await queryRunner.query(`DROP TABLE "income"`);
    }

}
