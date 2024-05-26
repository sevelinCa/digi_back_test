import { MigrationInterface, QueryRunner } from "typeorm";

export class UdpateProfessionalBody1709136273838 implements MigrationInterface {
  name = "UdpateProfessionalBody1709136273838";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accreditation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accreditationName" character varying NOT NULL, "professionalBodyId" uuid NOT NULL, CONSTRAINT "PK_1aa1d5e25cfdf9c0f99a74c9157" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "professional_body_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "professionalBodyName" character varying NOT NULL, CONSTRAINT "PK_f7ebcc316bdf5260b21ada5e54a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "digifranchiseName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "facebookHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "tiktokHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "instagramHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "xHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "connectNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "otherMobileNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "aboutCompany"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "location"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "digifranchiseName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "facebookHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "tiktokHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "instagramHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "xHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "address" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "connectNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "otherMobileNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "aboutCompany" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "location" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "professionalOrganization" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "accreditation" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "renewelDate" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ALTER COLUMN "ownedDigifranchiseId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "ownedDigifranchiseId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ALTER COLUMN "ownedDigifranchiseId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accreditation" ADD CONSTRAINT "FK_5f268144b7f3d54e3cf668d1c65" FOREIGN KEY ("professionalBodyId") REFERENCES "professional_body_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" DROP CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accreditation" DROP CONSTRAINT "FK_5f268144b7f3d54e3cf668d1c65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ALTER COLUMN "ownedDigifranchiseId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ALTER COLUMN "ownedDigifranchiseId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ALTER COLUMN "ownedDigifranchiseId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "renewelDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "accreditation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "professionalOrganization"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "location"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "aboutCompany"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "otherMobileNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "connectNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "xHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "instagramHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "tiktokHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "facebookHandle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "digifranchiseName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "location" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "aboutCompany" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "otherMobileNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "connectNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "address" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "xHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "instagramHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "tiktokHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "facebookHandle" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "digifranchiseName" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "professional_body_entity"`);
    await queryRunner.query(`DROP TABLE "accreditation"`);
  }
}
