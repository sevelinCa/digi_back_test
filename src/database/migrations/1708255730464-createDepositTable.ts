import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepositTable1708255730464 implements MigrationInterface {
    name = 'CreateDepositTable1708255730464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deposit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "item" character varying NOT NULL, "monthPaid" integer NOT NULL, "monthRecovered" integer NOT NULL, "depositAmount" numeric(10,2) NOT NULL, "depositedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "franchiseId" uuid, CONSTRAINT "PK_6654b4be449dadfd9d03a324b61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7"`);
        await queryRunner.query(`DROP TABLE "deposit"`);
    }

}
