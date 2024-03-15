import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { RateTable } from './entities/rate.entity';
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



}