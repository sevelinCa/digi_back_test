import { MigrationInterface, QueryRunner } from "typeorm";

export class SetCompliance1709026462025 implements MigrationInterface {
    name = 'SetCompliance1709026462025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operating_parameters" DROP CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_1e0bf855767085f945f8f5be914"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_e84934482e42bb311c168a725c3"`);
        await queryRunner.query(`ALTER TABLE "funding" DROP CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613"`);
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7"`);
        await queryRunner.query(`CREATE TABLE "digifranchise_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying(255) NOT NULL, "userFullNames" character varying(255) NOT NULL, "role" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, CONSTRAINT "PK_c2e97b38553384a30b7eaa2119d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_compliance_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyRegisterationNumber" character varying NOT NULL, "taxNumber" character varying NOT NULL, "taxClearencePin" character varying NOT NULL, "coidaRegisteration" character varying NOT NULL, "uifRegistration" character varying NOT NULL, "workMansCompensation" character varying NOT NULL, "sdlNumber" character varying NOT NULL, "otherComplianceDocs" character varying NOT NULL, "uploadedDocs" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchiseId" uuid, CONSTRAINT "REL_aaf18ed9b15cc56f76043dc0d5" UNIQUE ("ownedDigifranchiseId"), CONSTRAINT "PK_a1fa2dda83341520b251af11b4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_general_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "digifranchiseName" character varying NOT NULL, "facebookHandle" character varying NOT NULL, "tiktokHandle" character varying NOT NULL, "instagramHandle" character varying NOT NULL, "xHandle" character varying NOT NULL, "address" character varying NOT NULL, "connectNumber" character varying NOT NULL, "otherMobileNumber" character varying NOT NULL, "aboutCompany" character varying NOT NULL, "location" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchiseId" uuid, CONSTRAINT "REL_628ee3d8e80b874079732697d6" UNIQUE ("ownedDigifranchiseId"), CONSTRAINT "PK_3e04643b9802b6e9df3c9940334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owner" ADD CONSTRAINT "FK_ec84f32aa49df4ce82a85c84e5c" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" ADD CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_1e0bf855767085f945f8f5be914" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_e84934482e42bb311c168a725c3" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "funding" ADD CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`);
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03"`);
        await queryRunner.query(`ALTER TABLE "funding" DROP CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_e84934482e42bb311c168a725c3"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_1e0bf855767085f945f8f5be914"`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" DROP CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owner" DROP CONSTRAINT "FK_ec84f32aa49df4ce82a85c84e5c"`);
        await queryRunner.query(`DROP TABLE "digifranchise_general_info"`);
        await queryRunner.query(`DROP TABLE "digifranchise_compliance_info"`);
        await queryRunner.query(`DROP TABLE "digifranchise_owner"`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "funding" ADD CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_e84934482e42bb311c168a725c3" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_1e0bf855767085f945f8f5be914" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" ADD CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
