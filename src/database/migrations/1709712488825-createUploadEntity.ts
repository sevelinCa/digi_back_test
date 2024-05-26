import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUploadEntity1709712488825 implements MigrationInterface {
  name = "CreateUploadEntity1709712488825";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "filePath" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
