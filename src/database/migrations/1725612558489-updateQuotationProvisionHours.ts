import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateQuotationProvisionHours1725612558489 implements MigrationInterface {
    name = 'UpdateQuotationProvisionHours1725612558489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "provisionHours"`);
        await queryRunner.query(`ALTER TABLE "quotations" ADD "provisionHours" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "provisionHours"`);
        await queryRunner.query(`ALTER TABLE "quotations" ADD "provisionHours" TIMESTAMP`);
    }

}
