import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDigifranchiseProfessionalBodyEntity1709548774411 implements MigrationInterface {
    name = 'UpdateDigifranchiseProfessionalBodyEntity1709548774411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_professional_body_membership" ADD "documents" json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_professional_body_membership" DROP COLUMN "documents"`);
    }

}
