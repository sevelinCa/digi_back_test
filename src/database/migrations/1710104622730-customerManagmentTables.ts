import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerManagmentTables1710104622730 implements MigrationInterface {
    name = 'CustomerManagmentTables1710104622730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer_management" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "mobile_number" character varying NOT NULL, "customer_type" character varying NOT NULL, "company_registration_number" character varying, "vat_number" character varying, "address" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "digifranchiseId" uuid, CONSTRAINT "PK_a3cc08741e7a6b80e5a7305083a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_management" ADD CONSTRAINT "FK_5d3d07103609a552f70249dfc36" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_management" ADD CONSTRAINT "FK_a456e18c923c7253a6d1f711943" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_management" DROP CONSTRAINT "FK_a456e18c923c7253a6d1f711943"`);
        await queryRunner.query(`ALTER TABLE "customer_management" DROP CONSTRAINT "FK_5d3d07103609a552f70249dfc36"`);
        await queryRunner.query(`DROP TABLE "customer_management"`);
    }

}
