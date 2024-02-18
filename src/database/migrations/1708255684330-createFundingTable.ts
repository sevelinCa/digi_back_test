import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFundingTable1708255684330 implements MigrationInterface {
    name = 'CreateFundingTable1708255684330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "funding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying NOT NULL, "monthReceived" integer NOT NULL, "repaymentTerm" integer NOT NULL, "annualInterestRate" numeric(5,2) NOT NULL, "fundedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "franchiseId" uuid, CONSTRAINT "PK_096afc0d11a08deb52da61f039e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "funding" ADD CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding" DROP CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613"`);
        await queryRunner.query(`DROP TABLE "funding"`);
    }

}
