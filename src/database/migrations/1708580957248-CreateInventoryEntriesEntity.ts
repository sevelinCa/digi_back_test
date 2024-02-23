import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInventoryEntriesEntity1708580957248 implements MigrationInterface {
    name = 'CreateInventoryEntriesEntity1708580957248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventory_entries" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "quantity" integer NOT NULL, 
            "costPerItem" integer NOT NULL, 
            "totalValue" integer, 
            "dateReceived" TIMESTAMP NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleteAt" TIMESTAMP, 
            "inventoryId" uuid,
            CONSTRAINT "PK_1528e3203da22723e29566514f1" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`ALTER TABLE "inventory_entries" 
            ADD CONSTRAINT "FK_6966c038058689cd59a10abe09d" FOREIGN KEY ("inventoryId") 
            REFERENCES "inventory"("id") 
            ON DELETE NO ACTION 
            ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_entries" DROP CONSTRAINT "FK_6966c038058689cd59a10abe09d"`);
        await queryRunner.query(`DROP TABLE "inventory_entries"`);
    }
}
