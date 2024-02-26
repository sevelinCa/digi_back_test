import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamingDigifranchiseServiceOfferedTable1708981824893 implements MigrationInterface {
    name = 'RenamingDigifranchiseServiceOfferedTable1708981824893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_1e0bf855767085f945f8f5be914"`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" DROP CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550"`);
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03"`);
        await queryRunner.query(`ALTER TABLE "funding" DROP CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_e84934482e42bb311c168a725c3"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7"`);
        await queryRunner.query(`CREATE TABLE "franchise_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying(255) NOT NULL, "userFullNames" character varying(255) NOT NULL, "role" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, CONSTRAINT "PK_1ff30a5a6b71d9819e1e4e4b7ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_service_offered" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, CONSTRAINT "PK_afa74ced0cfc1ef27e818336d08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "franchise_owner" ADD CONSTRAINT "FK_da2744f18b58db334edd3c08ad8" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_1e0bf855767085f945f8f5be914" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" ADD CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "funding" ADD CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_e84934482e42bb311c168a725c3" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7" FOREIGN KEY ("franchiseId") REFERENCES "franchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_e84934482e42bb311c168a725c3"`);
        await queryRunner.query(`ALTER TABLE "funding" DROP CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613"`);
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03"`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" DROP CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_1e0bf855767085f945f8f5be914"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1"`);
        await queryRunner.query(`ALTER TABLE "franchise_owner" DROP CONSTRAINT "FK_da2744f18b58db334edd3c08ad8"`);
        await queryRunner.query(`DROP TABLE "digifranchise_service_offered"`);
        await queryRunner.query(`DROP TABLE "franchise_owner"`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7" FOREIGN KEY ("franchiseId") REFERENCES "franchise_ownership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_e84934482e42bb311c168a725c3" FOREIGN KEY ("franchiseId") REFERENCES "franchise_ownership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "funding" ADD CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613" FOREIGN KEY ("franchiseId") REFERENCES "franchise_ownership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03" FOREIGN KEY ("franchiseId") REFERENCES "franchise_ownership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" ADD CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550" FOREIGN KEY ("franchiseId") REFERENCES "franchise_ownership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_1e0bf855767085f945f8f5be914" FOREIGN KEY ("franchiseId") REFERENCES "franchise_ownership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
