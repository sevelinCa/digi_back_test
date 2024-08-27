import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuotationTable1724864792086 implements MigrationInterface {
    name = 'CreateQuotationTable1724864792086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quotation_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "fullName" character varying(255) NOT NULL, "quantity" integer, "price" numeric NOT NULL, "expiryDate" TIMESTAMP, "digifranchiseUrl" character varying(255) NOT NULL, "otherInfo" json, "ownedDigifranchiseId" uuid, "quotation" uuid, "product" uuid, "service" uuid, "subService" uuid, "serviceCategory" uuid, "subProduct" uuid, CONSTRAINT "REL_c595fa8755d179ee185768d7d2" UNIQUE ("quotation"), CONSTRAINT "PK_7f3c6238228cb519e5aecba5639" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quotations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isOrdered" boolean NOT NULL DEFAULT false, "totalPrice" numeric(10,2) DEFAULT '0', "taxAmount" numeric(10,2) DEFAULT '0', "provisionHours" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "quotationRequest" uuid NOT NULL, CONSTRAINT "REL_9233b039926956cdef2cd19b3a" UNIQUE ("quotationRequest"), CONSTRAINT "PK_6c00eb8ba181f28c21ffba7ecb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quotation_request" ADD CONSTRAINT "FK_c5f7bd7aba32561a4ea7edaa2be" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotation_request" ADD CONSTRAINT "FK_c595fa8755d179ee185768d7d2b" FOREIGN KEY ("quotation") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotation_request" ADD CONSTRAINT "FK_49df366896f5839b3c1f0a544d0" FOREIGN KEY ("product") REFERENCES "digifranchise_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotation_request" ADD CONSTRAINT "FK_9a610a1a2486da49a4f99588608" FOREIGN KEY ("service") REFERENCES "digifranchise_service_offered"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotation_request" ADD CONSTRAINT "FK_78a0e198ac5d3254b2da35f519d" FOREIGN KEY ("subService") REFERENCES "digifranchise_sub_services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotation_request" ADD CONSTRAINT "FK_1e35890a66f99d3fae17b8d5f10" FOREIGN KEY ("serviceCategory") REFERENCES "digifranchise_service_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotation_request" ADD CONSTRAINT "FK_8d3e3d013237d72b94d38e6f601" FOREIGN KEY ("subProduct") REFERENCES "digifranchise_sub_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotations" ADD CONSTRAINT "FK_9233b039926956cdef2cd19b3a5" FOREIGN KEY ("quotationRequest") REFERENCES "quotation_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quotations" DROP CONSTRAINT "FK_9233b039926956cdef2cd19b3a5"`);
        await queryRunner.query(`ALTER TABLE "quotation_request" DROP CONSTRAINT "FK_8d3e3d013237d72b94d38e6f601"`);
        await queryRunner.query(`ALTER TABLE "quotation_request" DROP CONSTRAINT "FK_1e35890a66f99d3fae17b8d5f10"`);
        await queryRunner.query(`ALTER TABLE "quotation_request" DROP CONSTRAINT "FK_78a0e198ac5d3254b2da35f519d"`);
        await queryRunner.query(`ALTER TABLE "quotation_request" DROP CONSTRAINT "FK_9a610a1a2486da49a4f99588608"`);
        await queryRunner.query(`ALTER TABLE "quotation_request" DROP CONSTRAINT "FK_49df366896f5839b3c1f0a544d0"`);
        await queryRunner.query(`ALTER TABLE "quotation_request" DROP CONSTRAINT "FK_c595fa8755d179ee185768d7d2b"`);
        await queryRunner.query(`ALTER TABLE "quotation_request" DROP CONSTRAINT "FK_c5f7bd7aba32561a4ea7edaa2be"`);
        await queryRunner.query(`DROP TABLE "quotations"`);
        await queryRunner.query(`DROP TABLE "quotation_request"`);
    }

}
