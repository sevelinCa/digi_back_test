import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductTable1709096938205 implements MigrationInterface {
    name = 'UpdateProductTable1709096938205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_2f17c791672d285095180d2dfc1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_2f17c791672d285095180d2dfc1"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" DROP COLUMN "userId"`);
    }

}
