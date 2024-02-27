import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1709022577997 implements MigrationInterface {
    name = 'UpdateUserTable1709022577997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "idImage" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "race" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "homeAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "educationLevel" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "currentActivity" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "fieldOfStudy" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "qualifications" json`);
        await queryRunner.query(`ALTER TABLE "user" ADD "professionalBody" json`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isProfileComplete" boolean DEFAULT false`);
        await queryRunner.query(`CREATE INDEX "IDX_3bd3f2e16165d1dac3e8e13286" ON "user" ("image") `);
        await queryRunner.query(`CREATE INDEX "IDX_d03cc9951fbb73d092fa53127e" ON "user" ("idImage") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0f3f1de3c7590ddf4299b6596" ON "user" ("gender") `);
        await queryRunner.query(`CREATE INDEX "IDX_91c1ef85a7e6c89eaeec99bfd6" ON "user" ("race") `);
        await queryRunner.query(`CREATE INDEX "IDX_9086fd0adfc3fdd84a443dd1b1" ON "user" ("homeAddress") `);
        await queryRunner.query(`CREATE INDEX "IDX_083056026899d829066008244b" ON "user" ("educationLevel") `);
        await queryRunner.query(`CREATE INDEX "IDX_772c766ebfc783bb03fa5e3404" ON "user" ("currentActivity") `);
        await queryRunner.query(`CREATE INDEX "IDX_a5e03f420f37f1f2270ec3f7a9" ON "user" ("fieldOfStudy") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a5e03f420f37f1f2270ec3f7a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_772c766ebfc783bb03fa5e3404"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_083056026899d829066008244b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9086fd0adfc3fdd84a443dd1b1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91c1ef85a7e6c89eaeec99bfd6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0f3f1de3c7590ddf4299b6596"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d03cc9951fbb73d092fa53127e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3bd3f2e16165d1dac3e8e13286"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isProfileComplete"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "professionalBody"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "qualifications"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fieldOfStudy"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "currentActivity"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "educationLevel"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "homeAddress"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "race"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "idImage"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "image"`);
    }

}
