import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { RateTable } from './entities/tax-rate.entity';
import { CreateRateDto, UpdateRateDto } from './dto/rate.dto';

@Injectable()
export class RateService {
 constructor(
    @InjectRepository(RateTable)
    private readonly rateTableRepository: Repository<RateTable>,
 ) {}

 async createRateTable(createRateDto: CreateRateDto): Promise<RateTable> {
    const newRateTable = this.rateTableRepository.create(createRateDto);
    const savedRateTable = await this.rateTableRepository.save(newRateTable);
    return savedRateTable;
 }
 async getAllRateTables(): Promise<RateTable[]> {
    return this.rateTableRepository.find({ where: { deleteAt: IsNull() } });
}

 async getOneRateTable(id: string): Promise<RateTable> {
    const rateTable = await this.rateTableRepository.findOne({ where: { id, deleteAt: IsNull() } });
    if (!rateTable) {
      throw new NotFoundException(`RateTable with ID ${id} not found.`);
    }
    return rateTable;
 }

 async updateRateTable(id: string, updateRateDto: UpdateRateDto): Promise<RateTable> {
    const rateTable = await this.rateTableRepository.findOne({ where: { id, deleteAt: IsNull() } });
    if (!rateTable) {
      throw new NotFoundException(`RateTable with ID ${id} not found.`);
    }
    this.rateTableRepository.merge(rateTable, updateRateDto);
    const updatedRateTable = await this.rateTableRepository.save(rateTable);
    return updatedRateTable;
 }

 async deleteRateTable(id: string): Promise<void> {
    const rateTable = await this.rateTableRepository.findOne({ where: { id } });
    if (!rateTable) {
      throw new NotFoundException(`RateTable with ID ${id} not found.`);
    }
    rateTable.deleteAt = new Date();
    await this.rateTableRepository.save(rateTable);
 }


}