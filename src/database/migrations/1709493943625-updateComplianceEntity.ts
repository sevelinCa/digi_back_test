import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateComplianceEntity1709493943625 implements MigrationInterface {
    name = 'UpdateComplianceEntity1709493943625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD "taxClearenceExpiration" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "taxClearenceExpiration"`);
    }

}
