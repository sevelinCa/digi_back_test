import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNotFoundException } from 'src/middlewares/accounting.exceptions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Digifranchise } from './entities/digifranchise.entity';

@Injectable()
export class DigifranchiseService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Digifranchise)
    private digifranchiseRepository: Repository<Digifranchise>,
  ) {}

  async createDigifranchise(
    userId: string,
    franchiseName?: string,
   ): Promise<Digifranchise> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    const existingDigifranchise = await this.digifranchiseRepository.findOne({ where: { userId: user.id } });
    if (existingDigifranchise) {
      throw new ConflictException('A Digifranchise already exists for this user.');
    }

    const userFullNames = `${user.firstName} ${user.lastName}`;

    const digifranchise = this.digifranchiseRepository.create({
      userId: user.id,
      userFullNames: userFullNames,
      franchiseName: franchiseName,  
    });

    return this.digifranchiseRepository.save(digifranchise);
  }
}
