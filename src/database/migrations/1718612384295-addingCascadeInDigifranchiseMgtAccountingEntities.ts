import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCascadeInDigifranchiseMgtAccountingEntities1718612384295
  implements MigrationInterface
{
  name = "AddingCascadeInDigifranchiseMgtAccountingEntities1718612384295";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_category" DROP CONSTRAINT "FK_240b0c23c7c4f0edf38fb827910"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_a730ef63a5affd24044c4134030"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_c80c8767cedc790c17243a5e57a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_60e78e864a4429c58348e3a2845"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_service_category" DROP CONSTRAINT "FK_5d9c767ba9555106fa4f3987e43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_df1712e88c792388ca3f60e14d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_d6c2685873d63d3395e9dcb9b1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_ca0bd1fb94e3f5a14c72bdcb7d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_b421043cbc4ef6382596af55390"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_2f7e6c72ac59db3b9e5e702a556"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" DROP CONSTRAINT "FK_c07ad4355ea31f770f26a0d3b9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" DROP CONSTRAINT "FK_465375308d5b5d8079a4d9e933d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_8c1df98ed8d874f9284a3101ea0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_0f4d0bb222d42ea6efc5b5085ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_86151d70a4800f8526d40811e08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_ae2d7e60007de6eca161274a97a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_d9a22f2c75d17c24d40482df349"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_1d30ef0b45d4439abf2f979a812"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_824735b6e3ed7ec5eabc9d76222"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_614e5860cbaab23cdf0fbd6b89c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_69da644f9ad6db633ec12577f59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_d6097137fe87e90a09d934e3970"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_37207487c424dc59d9f0de59db5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_c2b553ce6ea8024db0c0ebd76bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_c55830852b43c72edaa1c87ef5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_5f874121cc3db70869721cbec08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_45762ce41e7b96dc7853810b7d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" DROP CONSTRAINT "FK_89b14ce607290844cbfb4daa20a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" DROP CONSTRAINT "FK_804ff656af3f03a41f206f3ae0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_issue_table" DROP CONSTRAINT "FK_787811b8ffe5d8606e35b57ba51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" DROP CONSTRAINT "FK_280b677ce3d1795ddcd214bac41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_7170f7687d93372cc0c1adffc68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_a8a4aa6db3ecccb543a8e083e0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_ad92edbae545f0be95b4a1d45dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_2123af1e640c6ebb5916bac50d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_basic_info" DROP CONSTRAINT "FK_200ab288cdef21ff36691b96d9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" DROP CONSTRAINT "FK_bfde6b1c736cdbe135d4ee0216a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accreditation" DROP CONSTRAINT "FK_5f268144b7f3d54e3cf668d1c65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_entries" DROP CONSTRAINT "FK_6966c038058689cd59a10abe09d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_c65a872a294e35ecc04521cc89c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_issue_table" RENAME COLUMN "order" TO "orderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" DROP COLUMN "order"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" ADD "orderId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" ADD "orderIssueId" uuid`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."order_table_status_enum" RENAME TO "order_table_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_table_status_enum" AS ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'DECLINED', 'COMPLETE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ALTER COLUMN "status" TYPE "public"."order_table_status_enum" USING "status"::"text"::"public"."order_table_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_table_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_category" ADD CONSTRAINT "FK_240b0c23c7c4f0edf38fb827910" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_c80c8767cedc790c17243a5e57a" FOREIGN KEY ("digifranchiseService") REFERENCES "digifranchise_service_offered"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_a730ef63a5affd24044c4134030" FOREIGN KEY ("franchiseProduct") REFERENCES "digifranchise_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_60e78e864a4429c58348e3a2845" FOREIGN KEY ("digifranchiseProductId") REFERENCES "digifranchise_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_service_category" ADD CONSTRAINT "FK_5d9c767ba9555106fa4f3987e43" FOREIGN KEY ("subServiceId") REFERENCES "digifranchise_sub_services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_df1712e88c792388ca3f60e14d3" FOREIGN KEY ("digifranchiseServiceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_2f7e6c72ac59db3b9e5e702a556" FOREIGN KEY ("digifranchiseServiceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_b421043cbc4ef6382596af55390" FOREIGN KEY ("digifranchiseProductId") REFERENCES "digifranchise_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_ca0bd1fb94e3f5a14c72bdcb7d2" FOREIGN KEY ("subServiceId") REFERENCES "digifranchise_sub_services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_d6c2685873d63d3395e9dcb9b1f" FOREIGN KEY ("subProductId") REFERENCES "digifranchise_sub_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" ADD CONSTRAINT "FK_465375308d5b5d8079a4d9e933d" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" ADD CONSTRAINT "FK_c07ad4355ea31f770f26a0d3b9d" FOREIGN KEY ("fixedExpense") REFERENCES "fixed_expense_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_86151d70a4800f8526d40811e08" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_0f4d0bb222d42ea6efc5b5085ae" FOREIGN KEY ("unavailabilityId") REFERENCES "unavailability"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_8c1df98ed8d874f9284a3101ea0" FOREIGN KEY ("availabilitySlotsDetailsId") REFERENCES "availability_slots_details"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_824735b6e3ed7ec5eabc9d76222" FOREIGN KEY ("weekDay") REFERENCES "availability_week_days"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_1d30ef0b45d4439abf2f979a812" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_d9a22f2c75d17c24d40482df349" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_ae2d7e60007de6eca161274a97a" FOREIGN KEY ("availabilitySlotsDetailsId") REFERENCES "availability_slots_details"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_69da644f9ad6db633ec12577f59" FOREIGN KEY ("availabilityWeekDaysId") REFERENCES "availability_week_days"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_614e5860cbaab23cdf0fbd6b89c" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_c2b553ce6ea8024db0c0ebd76bc" FOREIGN KEY ("availabilityDayTime") REFERENCES "availability_day_time"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_37207487c424dc59d9f0de59db5" FOREIGN KEY ("availabilityWeekDays") REFERENCES "availability_week_days"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_d6097137fe87e90a09d934e3970" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_45762ce41e7b96dc7853810b7d6" FOREIGN KEY ("availabilityDayTime") REFERENCES "availability_day_time"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_5f874121cc3db70869721cbec08" FOREIGN KEY ("availabilityWeekDays") REFERENCES "availability_week_days"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_c55830852b43c72edaa1c87ef5d" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" ADD CONSTRAINT "FK_89b14ce607290844cbfb4daa20a" FOREIGN KEY ("slotId") REFERENCES "availability_slots_time_one_one"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" ADD CONSTRAINT "FK_804ff656af3f03a41f206f3ae0b" FOREIGN KEY ("digifranchise") REFERENCES "digifranchise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_issue_table" ADD CONSTRAINT "FK_d77b800ac159a65e4e542feb3e3" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" ADD CONSTRAINT "FK_47d268f47796be2a8d448f35e1a" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" ADD CONSTRAINT "FK_70176ad9a5bb2122201f8f523aa" FOREIGN KEY ("orderIssueId") REFERENCES "order_issue_table"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_2123af1e640c6ebb5916bac50d7" FOREIGN KEY ("productId") REFERENCES "digifranchise_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_ad92edbae545f0be95b4a1d45dc" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_a8a4aa6db3ecccb543a8e083e0a" FOREIGN KEY ("subProduct") REFERENCES "digifranchise_sub_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_7170f7687d93372cc0c1adffc68" FOREIGN KEY ("subService") REFERENCES "digifranchise_sub_services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_basic_info" ADD CONSTRAINT "FK_200ab288cdef21ff36691b96d9b" FOREIGN KEY ("order") REFERENCES "order_table"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" ADD CONSTRAINT "FK_bfde6b1c736cdbe135d4ee0216a" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accreditation" ADD CONSTRAINT "FK_5f268144b7f3d54e3cf668d1c65" FOREIGN KEY ("professionalBodyId") REFERENCES "professional_body_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_entries" ADD CONSTRAINT "FK_6966c038058689cd59a10abe09d" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_c65a872a294e35ecc04521cc89c" FOREIGN KEY ("fixedExpenseId") REFERENCES "fixed_expense_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_c65a872a294e35ecc04521cc89c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_entries" DROP CONSTRAINT "FK_6966c038058689cd59a10abe09d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accreditation" DROP CONSTRAINT "FK_5f268144b7f3d54e3cf668d1c65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" DROP CONSTRAINT "FK_bfde6b1c736cdbe135d4ee0216a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_basic_info" DROP CONSTRAINT "FK_200ab288cdef21ff36691b96d9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_7170f7687d93372cc0c1adffc68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_a8a4aa6db3ecccb543a8e083e0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_ad92edbae545f0be95b4a1d45dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_2123af1e640c6ebb5916bac50d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" DROP CONSTRAINT "FK_70176ad9a5bb2122201f8f523aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" DROP CONSTRAINT "FK_47d268f47796be2a8d448f35e1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_issue_table" DROP CONSTRAINT "FK_d77b800ac159a65e4e542feb3e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" DROP CONSTRAINT "FK_804ff656af3f03a41f206f3ae0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" DROP CONSTRAINT "FK_89b14ce607290844cbfb4daa20a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_c55830852b43c72edaa1c87ef5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_5f874121cc3db70869721cbec08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_45762ce41e7b96dc7853810b7d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_d6097137fe87e90a09d934e3970"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_37207487c424dc59d9f0de59db5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_c2b553ce6ea8024db0c0ebd76bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_614e5860cbaab23cdf0fbd6b89c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_69da644f9ad6db633ec12577f59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_ae2d7e60007de6eca161274a97a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_d9a22f2c75d17c24d40482df349"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_1d30ef0b45d4439abf2f979a812"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_824735b6e3ed7ec5eabc9d76222"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_8c1df98ed8d874f9284a3101ea0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_0f4d0bb222d42ea6efc5b5085ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_86151d70a4800f8526d40811e08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" DROP CONSTRAINT "FK_c07ad4355ea31f770f26a0d3b9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" DROP CONSTRAINT "FK_465375308d5b5d8079a4d9e933d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_d6c2685873d63d3395e9dcb9b1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_ca0bd1fb94e3f5a14c72bdcb7d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_b421043cbc4ef6382596af55390"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_2f7e6c72ac59db3b9e5e702a556"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_df1712e88c792388ca3f60e14d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_service_category" DROP CONSTRAINT "FK_5d9c767ba9555106fa4f3987e43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_60e78e864a4429c58348e3a2845"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_a730ef63a5affd24044c4134030"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_c80c8767cedc790c17243a5e57a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_category" DROP CONSTRAINT "FK_240b0c23c7c4f0edf38fb827910"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_table_status_enum_old" AS ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ALTER COLUMN "status" TYPE "public"."order_table_status_enum_old" USING "status"::"text"::"public"."order_table_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_table_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_table_status_enum_old" RENAME TO "order_table_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" DROP COLUMN "orderIssueId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" DROP COLUMN "orderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" ADD "order" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_issue_table" RENAME COLUMN "orderId" TO "order"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_c65a872a294e35ecc04521cc89c" FOREIGN KEY ("fixedExpenseId") REFERENCES "fixed_expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_entries" ADD CONSTRAINT "FK_6966c038058689cd59a10abe09d" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accreditation" ADD CONSTRAINT "FK_5f268144b7f3d54e3cf668d1c65" FOREIGN KEY ("professionalBodyId") REFERENCES "professional_body_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" ADD CONSTRAINT "FK_bfde6b1c736cdbe135d4ee0216a" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_basic_info" ADD CONSTRAINT "FK_200ab288cdef21ff36691b96d9b" FOREIGN KEY ("order") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_2123af1e640c6ebb5916bac50d7" FOREIGN KEY ("productId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_ad92edbae545f0be95b4a1d45dc" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_a8a4aa6db3ecccb543a8e083e0a" FOREIGN KEY ("subProduct") REFERENCES "digifranchise_sub_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_7170f7687d93372cc0c1adffc68" FOREIGN KEY ("subService") REFERENCES "digifranchise_sub_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" ADD CONSTRAINT "FK_280b677ce3d1795ddcd214bac41" FOREIGN KEY ("order") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_issue_table" ADD CONSTRAINT "FK_787811b8ffe5d8606e35b57ba51" FOREIGN KEY ("order") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" ADD CONSTRAINT "FK_804ff656af3f03a41f206f3ae0b" FOREIGN KEY ("digifranchise") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" ADD CONSTRAINT "FK_89b14ce607290844cbfb4daa20a" FOREIGN KEY ("slotId") REFERENCES "availability_slots_time_one_one"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_45762ce41e7b96dc7853810b7d6" FOREIGN KEY ("availabilityDayTime") REFERENCES "availability_day_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_5f874121cc3db70869721cbec08" FOREIGN KEY ("availabilityWeekDays") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_c55830852b43c72edaa1c87ef5d" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_c2b553ce6ea8024db0c0ebd76bc" FOREIGN KEY ("availabilityDayTime") REFERENCES "availability_day_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_37207487c424dc59d9f0de59db5" FOREIGN KEY ("availabilityWeekDays") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_d6097137fe87e90a09d934e3970" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_69da644f9ad6db633ec12577f59" FOREIGN KEY ("availabilityWeekDaysId") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_614e5860cbaab23cdf0fbd6b89c" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_824735b6e3ed7ec5eabc9d76222" FOREIGN KEY ("weekDay") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_1d30ef0b45d4439abf2f979a812" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_d9a22f2c75d17c24d40482df349" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_ae2d7e60007de6eca161274a97a" FOREIGN KEY ("availabilitySlotsDetailsId") REFERENCES "availability_slots_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_86151d70a4800f8526d40811e08" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_0f4d0bb222d42ea6efc5b5085ae" FOREIGN KEY ("unavailabilityId") REFERENCES "unavailability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_8c1df98ed8d874f9284a3101ea0" FOREIGN KEY ("availabilitySlotsDetailsId") REFERENCES "availability_slots_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" ADD CONSTRAINT "FK_465375308d5b5d8079a4d9e933d" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" ADD CONSTRAINT "FK_c07ad4355ea31f770f26a0d3b9d" FOREIGN KEY ("fixedExpense") REFERENCES "fixed_expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_2f7e6c72ac59db3b9e5e702a556" FOREIGN KEY ("digifranchiseServiceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_b421043cbc4ef6382596af55390" FOREIGN KEY ("digifranchiseProductId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_ca0bd1fb94e3f5a14c72bdcb7d2" FOREIGN KEY ("subServiceId") REFERENCES "digifranchise_sub_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_d6c2685873d63d3395e9dcb9b1f" FOREIGN KEY ("subProductId") REFERENCES "digifranchise_sub_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_df1712e88c792388ca3f60e14d3" FOREIGN KEY ("digifranchiseServiceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_service_category" ADD CONSTRAINT "FK_5d9c767ba9555106fa4f3987e43" FOREIGN KEY ("subServiceId") REFERENCES "digifranchise_sub_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_60e78e864a4429c58348e3a2845" FOREIGN KEY ("digifranchiseProductId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_c80c8767cedc790c17243a5e57a" FOREIGN KEY ("digifranchiseService") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_a730ef63a5affd24044c4134030" FOREIGN KEY ("franchiseProduct") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_category" ADD CONSTRAINT "FK_240b0c23c7c4f0edf38fb827910" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
