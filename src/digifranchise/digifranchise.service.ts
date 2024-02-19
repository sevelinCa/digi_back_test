import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotFoundException } from 'src/middlewares/accounting.exceptions';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import type { Repository } from 'typeorm';
import { Digifranchise } from './entities/digifranchise.entity';

@Injectable()
export class DigifranchiseService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(Digifranchise)
        private DigifranchiseRepository: Repository<Digifranchise>,
      ) {}
    
      async createDigifranchise(
        userId: string,
      ): Promise<Digifranchise> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new UserNotFoundException(userId);
        }
    
        const userFullNames = `${user.firstName} ${user.lastName}`;
    
        const Digifranchise = this.DigifranchiseRepository.create({
          userId: user.id,
          userFullNames: userFullNames,
        });
    
        return this.DigifranchiseRepository.save(Digifranchise);
      }
}
