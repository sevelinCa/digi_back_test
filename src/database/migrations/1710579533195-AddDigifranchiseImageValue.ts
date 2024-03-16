import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDigifranchiseImageValue1710579533195 implements MigrationInterface {
    name = 'AddDigifranchiseImageValue1710579533195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" ADD "digifranchiseImg" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise" DROP COLUMN "digifranchiseImg"`);
    }

}
