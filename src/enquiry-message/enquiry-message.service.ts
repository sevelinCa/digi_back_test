import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { Repository } from 'typeorm';
import { EnquiriesTable } from './entities/enquiries.entity';
import { CreateEnquiriesTableDto } from './dto/enquiries.dto';

@Injectable()
export class EnquiryMessageService {

    constructor(
        @InjectRepository(DigifranchiseOwner)
        private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
        @InjectRepository(EnquiriesTable)
        private readonly enquiriesRepository: Repository<EnquiriesTable>,
    ) { }

    async createEquiry(createEnquiriesTableDto: CreateEnquiriesTableDto, digifranchiseOwnerId: string): Promise<EnquiriesTable> {

        const digifranchise = await this.digifranchiseOwnerRepository.findOne({ where: { id: digifranchiseOwnerId } })
        if (!digifranchise) {
            throw new HttpException('Digifranchise not exist', HttpStatus.NOT_FOUND);
        }

        const newEquiry = this.enquiriesRepository.create({
            ...createEnquiriesTableDto,
            digifranchiseOwnerId: digifranchise
        });
        const savedEquiry = await this.enquiriesRepository.save(newEquiry);
        return savedEquiry;
    }
}
