import { MigrationInterface, QueryRunner } from "typeorm";

export class EditRenewalDate1709146167254 implements MigrationInterface {
    name = 'EditRenewalDate1709146167254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_professional_body_membership" RENAME COLUMN "renewelDate" TO "renewalDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_professional_body_membership" RENAME COLUMN "renewalDate" TO "renewelDate"`);
    }

}
