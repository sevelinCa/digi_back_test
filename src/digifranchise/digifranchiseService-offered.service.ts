import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigifranchiseServiceTable } from './entities/digifranchise-service.entity';
import { Digifranchise } from './entities/digifranchise.entity';

@Injectable()
export class DigifranchiseServiceOfferedService {
    
    constructor(
        @InjectRepository(DigifranchiseServiceTable)
        private readonly digifranchiseServiceRepository: Repository<DigifranchiseServiceTable>,
        @InjectRepository(Digifranchise)
        private readonly digifranchiseRepository: Repository<Digifranchise>
    ) {}

    async findAllActiveDigifranchiseServices(): Promise<{ services: DigifranchiseServiceTable[]; count: number }> {
        const queryBuilder = this.digifranchiseServiceRepository.createQueryBuilder('digifranchiseService');

        queryBuilder.leftJoinAndSelect('digifranchiseService.digifranchise', 'digifranchise');

        queryBuilder.where('digifranchiseService.deleteAt IS NULL');

        const services = await queryBuilder.getMany();
        const count = await queryBuilder.getCount();

        return { services, count };
    }

    async findAllDigifranchisesWithServices(): Promise<{ digifranchises: Digifranchise[]; count: number }> {
        const queryBuilder = this.digifranchiseRepository.createQueryBuilder('digifranchise');
    
        queryBuilder.leftJoinAndSelect('digifranchise.services', 'service');
        queryBuilder.where('digifranchise.deleteAt IS NULL');
    
        const digifranchises = await queryBuilder.getMany();
        const count = await queryBuilder.getCount();
    
        return { digifranchises, count };
    }
}