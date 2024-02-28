import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountingRelatedTables1709091321712 implements MigrationInterface {
    name = 'CreateAccountingRelatedTables1709091321712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "operating_parameters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "salesPaidByCreditCard" numeric(5,2) NOT NULL, "salesMadeOnCredit" numeric(5,2) NOT NULL, "averageCreditorTerms" integer NOT NULL, "averageDebtorTerms" integer NOT NULL, "operatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, CONSTRAINT "PK_10e28996d81cb21f85abb2975fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "income" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying(255) NOT NULL, "quantity" integer NOT NULL, "unityCost" numeric(10,2) NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "description" character varying(255) NOT NULL, "incomeDate" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, CONSTRAINT "PK_29a10f17b97568f70cee8586d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "funding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying NOT NULL, "monthReceived" integer NOT NULL, "repaymentTerm" integer NOT NULL, "annualInterestRate" numeric(5,2) NOT NULL, "fundedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, CONSTRAINT "PK_096afc0d11a08deb52da61f039e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fixed_expense_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fixedExpense" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, CONSTRAINT "UQ_0c2eda1361b7154b738c26b5471" UNIQUE ("fixedExpense"), CONSTRAINT "PK_7854a2cc680e3044f754d290afc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."expense_arrangement_enum" AS ENUM('cash', 'credit')`);
        await queryRunner.query(`CREATE TABLE "expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "arrangement" "public"."expense_arrangement_enum" NOT NULL DEFAULT 'cash', "monthlyExpense" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, "fixedExpenseId" uuid, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deposit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "item" character varying NOT NULL, "monthPaid" integer NOT NULL, "monthRecovered" integer NOT NULL, "depositAmount" numeric(10,2) NOT NULL, "depositedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, CONSTRAINT "PK_6654b4be449dadfd9d03a324b61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" ADD CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "funding" ADD CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fixed_expense_category" ADD CONSTRAINT "FK_a575d50e871d42879a93d145f09" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_e84934482e42bb311c168a725c3" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_c65a872a294e35ecc04521cc89c" FOREIGN KEY ("fixedExpenseId") REFERENCES "fixed_expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_c65a872a294e35ecc04521cc89c"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_e84934482e42bb311c168a725c3"`);
        await queryRunner.query(`ALTER TABLE "fixed_expense_category" DROP CONSTRAINT "FK_a575d50e871d42879a93d145f09"`);
        await queryRunner.query(`ALTER TABLE "funding" DROP CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613"`);
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03"`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" DROP CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550"`);
        await queryRunner.query(`DROP TABLE "deposit"`);
        await queryRunner.query(`DROP TABLE "expense"`);
        await queryRunner.query(`DROP TYPE "public"."expense_arrangement_enum"`);
        await queryRunner.query(`DROP TABLE "fixed_expense_category"`);
        await queryRunner.query(`DROP TABLE "funding"`);
        await queryRunner.query(`DROP TABLE "income"`);
        await queryRunner.query(`DROP TABLE "operating_parameters"`);
    }

}
