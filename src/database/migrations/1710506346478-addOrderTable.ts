import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderTable1710506346478 implements MigrationInterface {
    name = 'AddOrderTable1710506346478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calender_events" RENAME COLUMN "description" TO "eventDate"`);
        await queryRunner.query(`CREATE TYPE "public"."order_table_status_enum" AS ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "order_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "unitPrice" character varying(255) NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "status" "public"."order_table_status_enum" NOT NULL DEFAULT 'PENDING', "OrderDate" TIMESTAMP NOT NULL DEFAULT now(), "vatAmount" numeric(10,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "productId" uuid, "serviceId" uuid, CONSTRAINT "PK_2e52c3d2ee23b941afed22f6a38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rate_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rateName" character varying(255) NOT NULL, "rateNumber" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_8cb5ecb6da6da404b2cbfae4c30" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calender_event_guest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "customerId" uuid, "eventId" uuid, CONSTRAINT "PK_4db8f464545f64578e87f22e18c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calender_event_customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "customerId" uuid, "eventId" uuid, CONSTRAINT "PK_17fadcb1c03c868c34395c51d21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "calender_venue" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "calender_events" DROP COLUMN "eventDate"`);
        await queryRunner.query(`ALTER TABLE "calender_events" ADD "eventDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD CONSTRAINT "FK_6702e6613ff095d78ca480e326a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD CONSTRAINT "FK_2123af1e640c6ebb5916bac50d7" FOREIGN KEY ("productId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD CONSTRAINT "FK_ad92edbae545f0be95b4a1d45dc" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calender_event_guest" ADD CONSTRAINT "FK_3f8676d72b00c305f1742696a4c" FOREIGN KEY ("customerId") REFERENCES "customer_management"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calender_event_guest" ADD CONSTRAINT "FK_191f99a2329d5b373c99aa15acf" FOREIGN KEY ("eventId") REFERENCES "calender_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calender_event_customers" ADD CONSTRAINT "FK_b2f45fe62dc721d6b5680c9cc99" FOREIGN KEY ("customerId") REFERENCES "customer_management"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calender_event_customers" ADD CONSTRAINT "FK_fef46ced2571d9e496a993cc1ec" FOREIGN KEY ("eventId") REFERENCES "calender_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calender_event_customers" DROP CONSTRAINT "FK_fef46ced2571d9e496a993cc1ec"`);
        await queryRunner.query(`ALTER TABLE "calender_event_customers" DROP CONSTRAINT "FK_b2f45fe62dc721d6b5680c9cc99"`);
        await queryRunner.query(`ALTER TABLE "calender_event_guest" DROP CONSTRAINT "FK_191f99a2329d5b373c99aa15acf"`);
        await queryRunner.query(`ALTER TABLE "calender_event_guest" DROP CONSTRAINT "FK_3f8676d72b00c305f1742696a4c"`);
        await queryRunner.query(`ALTER TABLE "order_table" DROP CONSTRAINT "FK_ad92edbae545f0be95b4a1d45dc"`);
        await queryRunner.query(`ALTER TABLE "order_table" DROP CONSTRAINT "FK_2123af1e640c6ebb5916bac50d7"`);
        await queryRunner.query(`ALTER TABLE "order_table" DROP CONSTRAINT "FK_6702e6613ff095d78ca480e326a"`);
        await queryRunner.query(`ALTER TABLE "calender_events" DROP COLUMN "eventDate"`);
        await queryRunner.query(`ALTER TABLE "calender_events" ADD "eventDate" text`);
        await queryRunner.query(`ALTER TABLE "calender_venue" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "calender_event_customers"`);
        await queryRunner.query(`DROP TABLE "calender_event_guest"`);
        await queryRunner.query(`DROP TABLE "rate_table"`);
        await queryRunner.query(`DROP TABLE "order_table"`);
        await queryRunner.query(`DROP TYPE "public"."order_table_status_enum"`);
        await queryRunner.query(`ALTER TABLE "calender_events" RENAME COLUMN "eventDate" TO "description"`);
    }

}
