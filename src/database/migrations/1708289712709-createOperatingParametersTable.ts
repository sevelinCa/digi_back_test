import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOperatingParametersTable1708289712709 implements MigrationInterface {
    name = 'CreateOperatingParametersTable1708289712709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "operating_parameters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "salesPaidByCreditCard" numeric(5,2) NOT NULL, "salesMadeOnCredit" numeric(5,2) NOT NULL, "averageCreditorTerms" integer NOT NULL, "averageDebtorTerms" integer NOT NULL, "operatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "franchiseId" uuid, CONSTRAINT "PK_10e28996d81cb21f85abb2975fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" ADD CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operating_parameters" DROP CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550"`);
        await queryRunner.query(`DROP TABLE "operating_parameters"`);
    }

}
