import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDigifranchiseAccountTable1708249080840 implements MigrationInterface {
    name = 'CreateDigifranchiseAccountTable1708249080840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "digifranchise_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying(255) NOT NULL, "userFullNames" character varying(255) NOT NULL, "status" character varying(255) NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e432d4b1f625284358593e52f17" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "digifranchise_account"`);
    }

}
