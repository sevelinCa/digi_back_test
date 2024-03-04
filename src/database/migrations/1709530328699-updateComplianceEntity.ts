import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateComplianceEntity1709530328699 implements MigrationInterface {
    name = 'UpdateComplianceEntity1709530328699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "taxClearenceExpiration"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD "taxClearenceExpiration" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "taxClearenceExpiration"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD "taxClearenceExpiration" TIMESTAMP`);
    }

}
