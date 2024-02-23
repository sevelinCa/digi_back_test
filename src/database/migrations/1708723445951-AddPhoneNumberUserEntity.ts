import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumberUserEntity1708723445951 implements MigrationInterface {
    name = 'AddPhoneNumberUserEntity1708723445951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_7709ec402918e95e8b8888c75a9"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber")`);
        await queryRunner.query(`ALTER TABLE "inventory_entries" DROP CONSTRAINT "FK_6966c038058689cd59a10abe09d"`);
        await queryRunner.query(`ALTER TABLE "inventory_entries" ALTER COLUMN "totalValue" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_entries" ALTER COLUMN "inventoryId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "franchiseId"`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "franchiseId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_entries" ADD CONSTRAINT "FK_6966c038058689cd59a10abe09d" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_entries" DROP CONSTRAINT "FK_6966c038058689cd59a10abe09d"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "franchiseId"`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "franchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "inventory_entries" ALTER COLUMN "inventoryId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_entries" ALTER COLUMN "totalValue" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_entries" ADD CONSTRAINT "FK_6966c038058689cd59a10abe09d" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_f2578043e491921209f5dadd080"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_7709ec402918e95e8b8888c75a9" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
