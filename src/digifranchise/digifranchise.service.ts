import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotFoundException } from 'src/middlewares/accounting.exceptions';
import { User } from 'src/users/domain/user';
import type { Repository } from 'typeorm';
import { DigifranchiseAccount } from './entities/digifranchise-account.entity';

@Injectable()
export class DigifranchiseService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(DigifranchiseAccount)
        private digiFranchiseAccountRepository: Repository<DigifranchiseAccount>,
      ) {}
    
      async createDigiFranchiseAccount(
        userId: string,
      ): Promise<DigifranchiseAccount> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new UserNotFoundException(userId);
        }
    
        const userFullNames = `${user.firstName} ${user.lastName}`;
    
        const digifranchiseAccount = this.digiFranchiseAccountRepository.create({
          userId: user.id,
          userFullNames: userFullNames,
        });
    
        return this.digiFranchiseAccountRepository.save(digifranchiseAccount);
      }
}
