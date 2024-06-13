import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCascadeOnUserEntityRelations1718272852213
  implements MigrationInterface
{
  name = "AddingCascadeOnUserEntityRelations1718272852213";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supplier_management" DROP CONSTRAINT "FK_3fb9db823129e304bfbfb410330"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" DROP CONSTRAINT "FK_5d3d07103609a552f70249dfc36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_2048ea591b1711535d7a82bad36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_d8bcabd27efae3b578e215182ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_c4729ec60a40846cd2c5415828a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_2f17c791672d285095180d2dfc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_49a8550befbc41e3dd2aed09998"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fixed_expense_category" DROP CONSTRAINT "FK_a575d50e871d42879a93d145f09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" DROP CONSTRAINT "FK_faa4f1caf364e05551ae79b94e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" DROP CONSTRAINT "FK_275edb612f04767efbb286ce63f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" DROP CONSTRAINT "FK_533b0a815c8195e11ace856ae16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" DROP CONSTRAINT "FK_cdeb26c1e7f66aeda069b76e967"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_e21814e44acef02ccba5977885f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" DROP CONSTRAINT "FK_f5b7fc82f02c5c427647d18b030"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_6702e6613ff095d78ca480e326a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" DROP CONSTRAINT "FK_7f0dc3a05b9990e9e73a2dfb0b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_19265fb72d392fa655e6dc7f1dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ALTER COLUMN "digifranchisePublishedWithCC" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" ADD "userId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" ADD CONSTRAINT "FK_3fb9db823129e304bfbfb410330" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" ADD CONSTRAINT "FK_5d3d07103609a552f70249dfc36" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_2048ea591b1711535d7a82bad36" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_d8bcabd27efae3b578e215182ee" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_c4729ec60a40846cd2c5415828a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_2f17c791672d285095180d2dfc1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_49a8550befbc41e3dd2aed09998" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fixed_expense_category" ADD CONSTRAINT "FK_a575d50e871d42879a93d145f09" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" ADD CONSTRAINT "FK_faa4f1caf364e05551ae79b94e1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" ADD CONSTRAINT "FK_275edb612f04767efbb286ce63f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" ADD CONSTRAINT "FK_533b0a815c8195e11ace856ae16" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" ADD CONSTRAINT "FK_cdeb26c1e7f66aeda069b76e967" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_e21814e44acef02ccba5977885f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" ADD CONSTRAINT "FK_f5b7fc82f02c5c427647d18b030" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" ADD CONSTRAINT "FK_b2c9c5f59fbc93fddca4c7afa29" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_6702e6613ff095d78ca480e326a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" ADD CONSTRAINT "FK_7f0dc3a05b9990e9e73a2dfb0b4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_19265fb72d392fa655e6dc7f1dd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_19265fb72d392fa655e6dc7f1dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" DROP CONSTRAINT "FK_7f0dc3a05b9990e9e73a2dfb0b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_6702e6613ff095d78ca480e326a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" DROP CONSTRAINT "FK_b2c9c5f59fbc93fddca4c7afa29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" DROP CONSTRAINT "FK_f5b7fc82f02c5c427647d18b030"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_e21814e44acef02ccba5977885f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" DROP CONSTRAINT "FK_cdeb26c1e7f66aeda069b76e967"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" DROP CONSTRAINT "FK_533b0a815c8195e11ace856ae16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" DROP CONSTRAINT "FK_275edb612f04767efbb286ce63f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" DROP CONSTRAINT "FK_faa4f1caf364e05551ae79b94e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fixed_expense_category" DROP CONSTRAINT "FK_a575d50e871d42879a93d145f09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_49a8550befbc41e3dd2aed09998"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_2f17c791672d285095180d2dfc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_c4729ec60a40846cd2c5415828a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_d8bcabd27efae3b578e215182ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_2048ea591b1711535d7a82bad36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" DROP CONSTRAINT "FK_5d3d07103609a552f70249dfc36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" DROP CONSTRAINT "FK_3fb9db823129e304bfbfb410330"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" ADD "userId" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ALTER COLUMN "digifranchisePublishedWithCC" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_19265fb72d392fa655e6dc7f1dd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" ADD CONSTRAINT "FK_7f0dc3a05b9990e9e73a2dfb0b4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_6702e6613ff095d78ca480e326a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" ADD CONSTRAINT "FK_f5b7fc82f02c5c427647d18b030" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_e21814e44acef02ccba5977885f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" ADD CONSTRAINT "FK_cdeb26c1e7f66aeda069b76e967" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" ADD CONSTRAINT "FK_533b0a815c8195e11ace856ae16" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" ADD CONSTRAINT "FK_275edb612f04767efbb286ce63f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" ADD CONSTRAINT "FK_faa4f1caf364e05551ae79b94e1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fixed_expense_category" ADD CONSTRAINT "FK_a575d50e871d42879a93d145f09" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_49a8550befbc41e3dd2aed09998" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_2f17c791672d285095180d2dfc1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_c4729ec60a40846cd2c5415828a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_d8bcabd27efae3b578e215182ee" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_2048ea591b1711535d7a82bad36" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" ADD CONSTRAINT "FK_5d3d07103609a552f70249dfc36" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" ADD CONSTRAINT "FK_3fb9db823129e304bfbfb410330" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
