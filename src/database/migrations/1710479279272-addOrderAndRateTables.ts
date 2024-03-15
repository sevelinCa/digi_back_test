import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderAndRateTables1710479279272 implements MigrationInterface {
    name = 'AddOrderAndRateTables1710479279272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_table" DROP COLUMN "productOrServiceId"`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD "serviceId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD CONSTRAINT "FK_2123af1e640c6ebb5916bac50d7" FOREIGN KEY ("productId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD CONSTRAINT "FK_ad92edbae545f0be95b4a1d45dc" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_table" DROP CONSTRAINT "FK_ad92edbae545f0be95b4a1d45dc"`);
        await queryRunner.query(`ALTER TABLE "order_table" DROP CONSTRAINT "FK_2123af1e640c6ebb5916bac50d7"`);
        await queryRunner.query(`ALTER TABLE "order_table" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "order_table" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD "productOrServiceId" text NOT NULL`);
    }

}
