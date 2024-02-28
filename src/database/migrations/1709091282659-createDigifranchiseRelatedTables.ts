import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDigifranchiseRelatedTables1709091282659 implements MigrationInterface {
    name = 'CreateDigifranchiseRelatedTables1709091282659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "digifranchise" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "digifranchiseName" character varying(255), "description" text, "status" character varying(255) NOT NULL DEFAULT '2', "digifranchiseFee" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_b4e302f70d8b71fff39535ce172" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_service_offered" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, "userId" uuid, CONSTRAINT "PK_afa74ced0cfc1ef27e818336d08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_sub_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "serviceId" uuid, "userId" uuid, CONSTRAINT "PK_c54cc8929973fcde392c5c9825d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, "userId" uuid, CONSTRAINT "PK_d0a78c3c6099881ff03408a6466" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_sub_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "productId" uuid, CONSTRAINT "PK_800edce848e1bcb7658f502ade4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying(255) NOT NULL, "digifranchiseId" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchise" uuid, CONSTRAINT "PK_c2e97b38553384a30b7eaa2119d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_general_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "digifranchiseName" character varying NOT NULL, "facebookHandle" character varying NOT NULL, "tiktokHandle" character varying NOT NULL, "instagramHandle" character varying NOT NULL, "xHandle" character varying NOT NULL, "address" character varying NOT NULL, "connectNumber" character varying NOT NULL, "otherMobileNumber" character varying NOT NULL, "aboutCompany" character varying NOT NULL, "location" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchiseId" uuid, CONSTRAINT "REL_628ee3d8e80b874079732697d6" UNIQUE ("ownedDigifranchiseId"), CONSTRAINT "PK_3e04643b9802b6e9df3c9940334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_compliance_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyRegisterationNumber" character varying NOT NULL, "taxNumber" character varying NOT NULL, "taxClearencePin" character varying NOT NULL, "coidaRegisteration" character varying NOT NULL, "uifRegistration" character varying NOT NULL, "workMansCompensation" character varying NOT NULL, "sdlNumber" character varying NOT NULL, "otherComplianceDocs" character varying NOT NULL, "uploadedDocs" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchiseId" uuid, CONSTRAINT "REL_aaf18ed9b15cc56f76043dc0d5" UNIQUE ("ownedDigifranchiseId"), CONSTRAINT "PK_a1fa2dda83341520b251af11b4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_c4729ec60a40846cd2c5415828a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_60225831356d6a99720e2338068" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_49a8550befbc41e3dd2aed09998" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_2048ea591b1711535d7a82bad36" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_178e8f5d5c519e49c5424b7b67d" FOREIGN KEY ("productId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owner" ADD CONSTRAINT "FK_804ff656af3f03a41f206f3ae0b" FOREIGN KEY ("digifranchise") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owner" DROP CONSTRAINT "FK_804ff656af3f03a41f206f3ae0b"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_178e8f5d5c519e49c5424b7b67d"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_2048ea591b1711535d7a82bad36"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_49a8550befbc41e3dd2aed09998"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_60225831356d6a99720e2338068"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_c4729ec60a40846cd2c5415828a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1"`);
        await queryRunner.query(`DROP TABLE "digifranchise_compliance_info"`);
        await queryRunner.query(`DROP TABLE "digifranchise_general_info"`);
        await queryRunner.query(`DROP TABLE "digifranchise_owner"`);
        await queryRunner.query(`DROP TABLE "digifranchise_sub_product"`);
        await queryRunner.query(`DROP TABLE "digifranchise_product"`);
        await queryRunner.query(`DROP TABLE "digifranchise_sub_services"`);
        await queryRunner.query(`DROP TABLE "digifranchise_service_offered"`);
        await queryRunner.query(`DROP TABLE "digifranchise"`);
    }

}
