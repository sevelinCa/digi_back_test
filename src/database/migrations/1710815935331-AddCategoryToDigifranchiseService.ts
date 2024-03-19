import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryToDigifranchiseService1710815935331 implements MigrationInterface {
    name = 'AddCategoryToDigifranchiseService1710815935331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "digifranchise_service_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceCategoryName" character varying(255) NOT NULL, "unitPrice" character varying(255) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "serviceId" uuid, CONSTRAINT "PK_63547c1f159022c8b1caf7fb634" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_category" ADD CONSTRAINT "FK_240b0c23c7c4f0edf38fb827910" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_service_category" DROP CONSTRAINT "FK_240b0c23c7c4f0edf38fb827910"`);
        await queryRunner.query(`DROP TABLE "digifranchise_service_category"`);
    }

}
