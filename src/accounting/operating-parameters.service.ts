import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperatingParameters } from './entities/operationParamenters.entity';
import { CreateOperatingParametersDto } from './dto/Create-DTOs/create-operating-parameters.dto';
import { findOperatingParametersById } from 'src/helper/FindByFunctions';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';

@Injectable()
export class OperatingParametersService {
  constructor(
    @InjectRepository(OperatingParameters)
    private readonly operatingParametersRepository: Repository<OperatingParameters>,
    @InjectRepository(Digifranchise)
    private readonly DigifranchiseRepository: Repository<Digifranchise>,
  ) {}

  async createOperatingParameters(
    createOperatingParametersDto: CreateOperatingParametersDto,
    userId: string,
  ): Promise<OperatingParameters> {
    const franchiseAccount = await this.DigifranchiseRepository.findOne({
      where: { userId: userId },
    });

    if (!franchiseAccount) {
      throw new NotFoundException(
        `Franchise account not found for user with ID ${userId}`,
      );
    }

    const newOperatingParameters = this.operatingParametersRepository.create({
      ...createOperatingParametersDto,
      franchiseId: franchiseAccount,
    });

    return await this.operatingParametersRepository.save(
      newOperatingParameters,
    );
  }

  async findAllOperatingParameters(
    startDate?: string,
    endDate?: string,
  ): Promise<{ parameters: OperatingParameters[]; count: number }> {
    const queryBuilder = this.operatingParametersRepository.createQueryBuilder(
      'operatingParameters',
    );

    queryBuilder.leftJoinAndSelect(
      'operatingParameters.franchiseId',
      'franchise',
    );

    if (startDate) {
      queryBuilder.andWhere('operatingParameters.createdAt >= :startDate', {
        startDate,
      });
    }

    if (endDate) {
      queryBuilder.andWhere('operatingParameters.createdAt <= :endDate', {
        endDate,
      });
    }

    const parameters = await queryBuilder.getMany();
    const count = await queryBuilder.getCount();

    return { parameters, count };
  }

  async getOperatingParametersById(
    operatingParametersId: string,
  ): Promise<OperatingParameters | null> {
    return findOperatingParametersById(
      this.operatingParametersRepository,
      operatingParametersId,
    );
  }
}
