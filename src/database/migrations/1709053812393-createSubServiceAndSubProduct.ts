import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubServiceAndSubProduct1709053812393 implements MigrationInterface {
    name = 'CreateSubServiceAndSubProduct1709053812393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "digifranchise_sub_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "productId" uuid, CONSTRAINT "PK_800edce848e1bcb7658f502ade4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_sub_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "serviceId" uuid, "userId" uuid, CONSTRAINT "PK_c54cc8929973fcde392c5c9825d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_178e8f5d5c519e49c5424b7b67d" FOREIGN KEY ("productId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_60225831356d6a99720e2338068" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_49a8550befbc41e3dd2aed09998" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_49a8550befbc41e3dd2aed09998"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_60225831356d6a99720e2338068"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_178e8f5d5c519e49c5424b7b67d"`);
        await queryRunner.query(`DROP TABLE "digifranchise_sub_services"`);
        await queryRunner.query(`DROP TABLE "digifranchise_sub_product"`);
    }

}
