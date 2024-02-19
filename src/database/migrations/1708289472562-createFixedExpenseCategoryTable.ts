import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFixedExpenseCategoryTable1708289472562 implements MigrationInterface {
    name = 'CreateFixedExpenseCategoryTable1708289472562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fixed_expense_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fixedExpense" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_0c2eda1361b7154b738c26b5471" UNIQUE ("fixedExpense"), CONSTRAINT "PK_7854a2cc680e3044f754d290afc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "fixed_expense_category" ADD CONSTRAINT "FK_a575d50e871d42879a93d145f09" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fixed_expense_category" DROP CONSTRAINT "FK_a575d50e871d42879a93d145f09"`);
        await queryRunner.query(`DROP TABLE "fixed_expense_category"`);
    }

}
