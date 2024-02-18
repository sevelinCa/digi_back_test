import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInventoryTable1708255584033 implements MigrationInterface {
    name = 'CreateInventoryTable1708255584033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemName" character varying(255) NOT NULL, "quantity" integer NOT NULL, "costPerItem" numeric(10,2) NOT NULL, "month" character varying(255) NOT NULL, "totalValue" numeric(10,2) NOT NULL, "dateReceived" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "franchiseId" uuid, "monthlyInventoryQuantity" integer NOT NULL, "monthlyInventoryCostperitem" numeric(10,2) NOT NULL, "monthlyInventoryMonth" character varying(255) NOT NULL, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_7709ec402918e95e8b8888c75a9" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_7709ec402918e95e8b8888c75a9"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
    }

}
