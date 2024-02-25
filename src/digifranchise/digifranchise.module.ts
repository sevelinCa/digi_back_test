// import { Module } from '@nestjs/common';
// import { DigifranchiseController } from './digifranchise.controller';
// import { DigifranchiseService } from './digifranchise.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Digifranchise } from './entities/digifranchise.entity';
// import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       UserEntity,
//       Digifranchise
//     ]),
//   ],
//   controllers: [DigifranchiseController],
//   providers: [DigifranchiseService]
// })
// export class DigifranchiseModule {}