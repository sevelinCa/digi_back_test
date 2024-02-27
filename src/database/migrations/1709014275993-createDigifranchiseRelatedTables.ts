import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDigifranchiseRelatedTables1709014275993 implements MigrationInterface {
    name = 'CreateDigifranchiseRelatedTables1709014275993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "digifranchise" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "digifranchiseName" character varying(255), "description" text, "status" character varying(255) NOT NULL DEFAULT '2', "digifranchiseFee" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_b4e302f70d8b71fff39535ce172" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "franchise_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying(255) NOT NULL, "userFullNames" character varying(255) NOT NULL, "role" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, CONSTRAINT "PK_1ff30a5a6b71d9819e1e4e4b7ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_service_offered" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, "userId" uuid, CONSTRAINT "PK_afa74ced0cfc1ef27e818336d08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, CONSTRAINT "PK_d0a78c3c6099881ff03408a6466" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "franchise_owner" ADD CONSTRAINT "FK_da2744f18b58db334edd3c08ad8" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_c4729ec60a40846cd2c5415828a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_c4729ec60a40846cd2c5415828a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1"`);
        await queryRunner.query(`ALTER TABLE "franchise_owner" DROP CONSTRAINT "FK_da2744f18b58db334edd3c08ad8"`);
        await queryRunner.query(`DROP TABLE "digifranchise_product"`);
        await queryRunner.query(`DROP TABLE "digifranchise_service_offered"`);
        await queryRunner.query(`DROP TABLE "franchise_owner"`);
        await queryRunner.query(`DROP TABLE "digifranchise"`);
    }

}
