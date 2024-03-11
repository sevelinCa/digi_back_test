import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipToComplainceInfo1710132765876 implements MigrationInterface {
    name = 'AddRelationshipToComplainceInfo1710132765876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "ownedDigifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD "ownedDigifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "UQ_aaf18ed9b15cc56f76043dc0d5a" UNIQUE ("ownedDigifranchiseId")`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP CONSTRAINT "UQ_aaf18ed9b15cc56f76043dc0d5a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP COLUMN "ownedDigifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD "ownedDigifranchiseId" character varying NOT NULL`);
    }

}
