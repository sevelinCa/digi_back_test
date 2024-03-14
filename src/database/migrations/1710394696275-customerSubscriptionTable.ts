import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerSubscriptionTable1710394696275 implements MigrationInterface {
    name = 'CustomerSubscriptionTable1710394696275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer_subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "digifranchiseId" uuid, CONSTRAINT "PK_1a570a0f1783fbcf6123f18751f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "staff_management" ADD "image" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_19265fb72d392fa655e6dc7f1dd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_19265fb72d392fa655e6dc7f1dd"`);
        await queryRunner.query(`ALTER TABLE "staff_management" DROP COLUMN "image"`);
        await queryRunner.query(`DROP TABLE "customer_subscription"`);
    }

}
