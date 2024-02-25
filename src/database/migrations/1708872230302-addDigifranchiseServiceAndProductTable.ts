import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDigifranchiseServiceAndProductTable1708872230302 implements MigrationInterface {
    name = 'AddDigifranchiseServiceAndProductTable1708872230302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "digifranchise_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, CONSTRAINT "PK_d0a78c3c6099881ff03408a6466" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, CONSTRAINT "PK_646bccd0be305c2dfc356697af6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "franchise_ownership" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, CONSTRAINT "PK_ff8ed04c9e05814739fc200f975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "Description"`);
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "ServicesOffered"`);
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "digifranchise" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service" ADD CONSTRAINT "FK_34f8af4421c5327fa0308c3a50f" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "franchise_ownership" ADD CONSTRAINT "FK_6bd9d9bc03179670f0f83ff0dba" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "franchise_ownership" DROP CONSTRAINT "FK_6bd9d9bc03179670f0f83ff0dba"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service" DROP CONSTRAINT "FK_34f8af4421c5327fa0308c3a50f"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98"`);
        await queryRunner.query(`ALTER TABLE "digifranchise" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "ServicesOffered" character varying(1000)`);
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "Description" character varying(1000)`);
        await queryRunner.query(`DROP TABLE "franchise_ownership"`);
        await queryRunner.query(`DROP TABLE "digifranchise_service"`);
        await queryRunner.query(`DROP TABLE "digifranchise_product"`);
    }

}
