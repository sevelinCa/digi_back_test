import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNotFoundException } from 'src/middlewares/accounting.exceptions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { CreateDigifranchiseDto } from './dto/create-digifranchise.dto';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';

@Injectable()
export class DigifranchiseService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Digifranchise)
    private digifranchiseRepository: Repository<Digifranchise>,
  ) {}

  // async createDigifranchise(
  //   userId: string,
  //   digifranchiseDto: CreateDigifranchiseDto
  //  ): Promise<Digifranchise> {
  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new UserNotFoundException(userId);
  //   }

  //   const existingDigifranchise = await this.digifranchiseRepository.findOne({ where: { franchiseName: digifranchiseDto.franchiseName } });
  //   if (existingDigifranchise) {
  //     throw new ConflictException('A Digifranchise already exists with this name');
  //   }

  //   const userFullNames = `${user.firstName} ${user.lastName}`;

  //   const digifranchise = this.digifranchiseRepository.create({
  //     userId: user.id,
  //     userFullNames: userFullNames,
  //     franchiseName: digifranchiseDto.franchiseName,
  //     Description: digifranchiseDto.description,
  //     ServicesOffered: digifranchiseDto.servicesOffered
  //   });

  //   return this.digifranchiseRepository.save(digifranchise);
  // }

  // async getAllDigifranchiseByUser(userId: string): Promise<Digifranchise[]> {
  //   const digifranchises = this.digifranchiseRepository.find({ where: { userId }})
  //   return digifranchises
  // }

  async getAllDigifranchises(): Promise<Digifranchise[]> {
    const digifranchises = this.digifranchiseRepository.find()
    return digifranchises
  }
}
