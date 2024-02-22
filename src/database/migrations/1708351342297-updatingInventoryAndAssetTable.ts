import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatingInventoryAndAssetTable1708351342297 implements MigrationInterface {
    name = 'UpdatingInventoryAndAssetTable1708351342297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "inventory" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "itemName" character varying(255) NOT NULL, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "franchiseId" uuid,
                CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "inventory" ADD CONSTRAINT "FK_7709ec402918e95e8b8888c75a9" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_7709ec402918e95e8b8888c75a9"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
    }
}
