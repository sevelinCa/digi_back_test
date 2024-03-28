import { MigrationInterface, QueryRunner } from "typeorm";

export class AssociateOrderWIthComplainAndIssueTables1711586314362 implements MigrationInterface {
    name = 'AssociateOrderWIthComplainAndIssueTables1711586314362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_issue_table" DROP CONSTRAINT "FK_d77b800ac159a65e4e542feb3e3"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" DROP CONSTRAINT "FK_7eb5068d8d9b19f19f7d9fdf6ef"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" DROP CONSTRAINT "FK_47d268f47796be2a8d448f35e1a"`);
        await queryRunner.query(`ALTER TABLE "order_basic_info" DROP CONSTRAINT "FK_6bf9bf7a2e6fc5044aac409a98f"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "order_issue_table" RENAME COLUMN "orderId" TO "order"`);
        await queryRunner.query(`ALTER TABLE "order_basic_info" RENAME COLUMN "orderId" TO "order"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" DROP COLUMN "issueId"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" ADD "order" uuid`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" ADD "issue" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_issue_table" ADD CONSTRAINT "FK_787811b8ffe5d8606e35b57ba51" FOREIGN KEY ("order") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" ADD CONSTRAINT "FK_280b677ce3d1795ddcd214bac41" FOREIGN KEY ("order") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" ADD CONSTRAINT "FK_0a47ddad305561cd9ad81932efa" FOREIGN KEY ("issue") REFERENCES "order_issue_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_basic_info" ADD CONSTRAINT "FK_200ab288cdef21ff36691b96d9b" FOREIGN KEY ("order") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "order_basic_info" DROP CONSTRAINT "FK_200ab288cdef21ff36691b96d9b"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" DROP CONSTRAINT "FK_0a47ddad305561cd9ad81932efa"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" DROP CONSTRAINT "FK_280b677ce3d1795ddcd214bac41"`);
        await queryRunner.query(`ALTER TABLE "order_issue_table" DROP CONSTRAINT "FK_787811b8ffe5d8606e35b57ba51"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" DROP COLUMN "issue"`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" ADD "issueId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_basic_info" RENAME COLUMN "order" TO "orderId"`);
        await queryRunner.query(`ALTER TABLE "order_issue_table" RENAME COLUMN "order" TO "orderId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_basic_info" ADD CONSTRAINT "FK_6bf9bf7a2e6fc5044aac409a98f" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" ADD CONSTRAINT "FK_47d268f47796be2a8d448f35e1a" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_complaints_table" ADD CONSTRAINT "FK_7eb5068d8d9b19f19f7d9fdf6ef" FOREIGN KEY ("issueId") REFERENCES "order_issue_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_issue_table" ADD CONSTRAINT "FK_d77b800ac159a65e4e542feb3e3" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
