import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuotationTable1723892467033 implements MigrationInterface {
    name = 'CreateQuotationTable1723892467033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quotations" ADD "quotationRequest" uuid`);
        await queryRunner.query(`ALTER TABLE "quotations" ADD CONSTRAINT "UQ_9233b039926956cdef2cd19b3a5" UNIQUE ("quotationRequest")`);
        await queryRunner.query(`ALTER TABLE "quotation_request" DROP CONSTRAINT "FK_c595fa8755d179ee185768d7d2b"`);
        await queryRunner.query(`ALTER TABLE "quotation_request" ADD CONSTRAINT "UQ_c595fa8755d179ee185768d7d2b" UNIQUE ("quotation")`);
        await queryRunner.query(`ALTER TABLE "quotations" ADD CONSTRAINT "FK_9233b039926956cdef2cd19b3a5" FOREIGN KEY ("quotationRequest") REFERENCES "quotation_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotation_request" ADD CONSTRAINT "FK_c595fa8755d179ee185768d7d2b" FOREIGN KEY ("quotation") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quotation_request" DROP CONSTRAINT "FK_c595fa8755d179ee185768d7d2b"`);
        await queryRunner.query(`ALTER TABLE "quotations" DROP CONSTRAINT "FK_9233b039926956cdef2cd19b3a5"`);
        await queryRunner.query(`ALTER TABLE "quotation_request" DROP CONSTRAINT "UQ_c595fa8755d179ee185768d7d2b"`);
        await queryRunner.query(`ALTER TABLE "quotation_request" ADD CONSTRAINT "FK_c595fa8755d179ee185768d7d2b" FOREIGN KEY ("quotation") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotations" DROP CONSTRAINT "UQ_9233b039926956cdef2cd19b3a5"`);
        await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "quotationRequest"`);
    }

}
