import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateComplianceDocsEntity1709531041027 implements MigrationInterface {
    name = 'UpdateComplianceDocsEntity1709531041027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "uploadedDocs"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD "uploadedDocs" json`);
    }

}
