import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderCode1714636944701 implements MigrationInterface {
  name = "AddOrderCode1714636944701";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD "orderCode" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP COLUMN "orderCode"`,
    );
  }
}
