import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { QuotationEntity } from "./quotation.entity";

@Injectable()
export class QuotationRepository extends Repository<QuotationEntity> {
  constructor(private dataSource: DataSource) {
    super(QuotationEntity, dataSource.createEntityManager());
  }

  async findWithOwnerId(id: string): Promise<QuotationEntity | null> {
    return this.createQueryBuilder("quotation")
      .leftJoinAndSelect("quotation.ownedDigifranchiseId", "owner")
      .select(["quotation", "owner.id"])
      .where("quotation.id = :id", { id })
      .getOne();
  }
}
