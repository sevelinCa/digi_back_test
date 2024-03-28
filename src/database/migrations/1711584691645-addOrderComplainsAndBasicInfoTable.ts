import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderComplainsAndBasicInfoTable1711584691645 implements MigrationInterface {
    name = 'AddOrderComplainsAndBasicInfoTable1711584691645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`CREATE TABLE "order_basic_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullNames" text NOT NULL, "contactDetails" text NOT NULL, "address" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "orderId" uuid, CONSTRAINT "PK_d7750262a8c5631f16cefe50401" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_issue_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "issue_description" text NOT NULL, "isSelected" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "orderId" uuid, CONSTRAINT "PK_5217487197177105c8fcf28caaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_complaints_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "custom_issue_description" text NOT NULL, "additional_information" text NOT NULL, "refund_requested" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "orderId" uuid, "issueId" uuid, CONSTRAINT "PK_54f300ba262fc3d8ae7fbd91098" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);

        // Update NULL values in orderNumber to a default integer value
        await queryRunner.query(`UPDATE "order_table" SET "orderNumber" = 0 WHERE "orderNumber" IS NULL`);

        // Now, set orderNumber to NOT NULL
        await queryRunner.query(`ALTER TABLE "order_table" ALTER COLUMN "orderNumber" SET NOT NULL`);

        await queryRunner.query(`ALTER TABLE "order_basic_info" ADD CONSTRAINT "FK_6bf9bf7a2e6fc5044aac409a98f" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_issue_table" ADD CONSTRAINT "FK_d77b800ac159a65e4e542feb3e3" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" ADD CONSTRAINT "FK_47d268f47796be2a8d448f35e1a" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" ADD CONSTRAINT "FK_7eb5068d8d9b19f19f7d9fdf6ef" FOREIGN KEY ("issueId") REFERENCES "order_issue_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" DROP CONSTRAINT "FK_7eb5068d8d9b19f19f7d9fdf6ef"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" DROP CONSTRAINT "FK_47d268f47796be2a8d448f35e1a"`);
        await queryRunner.query(`ALTER TABLE "order_issue_table" DROP CONSTRAINT "FK_d77b800ac159a65e4e542feb3e3"`);
        await queryRunner.query(`ALTER TABLE "order_basic_info" DROP CONSTRAINT "FK_6bf9bf7a2e6fc5044aac409a98f"`);
        await queryRunner.query(`ALTER TABLE "order_table" ALTER COLUMN "orderNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`DROP TABLE "order_complaints_table"`);
        await queryRunner.query(`DROP TABLE "order_issue_table"`);
        await queryRunner.query(`DROP TABLE "order_basic_info"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
