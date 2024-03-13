import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomerSubscriptionTables1710306569342 implements MigrationInterface {
    name = 'AddCustomerSubscriptionTables1710306569342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_management" ADD "image" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_management" DROP COLUMN "image"`);
    }

}
