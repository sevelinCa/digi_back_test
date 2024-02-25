// import { Body, Controller, Post, Req, UseGuards, Get, Query } from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from 'src/roles/roles.guard';
// import { Roles } from 'src/roles/roles.decorator';
// import { RoleEnum } from 'src/roles/roles.enum';
// import { DigifranchiseService } from './digifranchise.service';
// import { CreateDigifranchiseDto } from './dto/create-digifranchise.dto'; // Import the DTO
// import type { Digifranchise } from './entities/digifranchise.entity';
// import type { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
// import { Request } from 'express';

// @ApiTags('Digifranchise')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
// @Controller({ path: 'digifranchise', version: '1' })
// export class DigifranchiseController {
//     constructor(private readonly digifranchiseService: DigifranchiseService) {}

//     @Roles(RoleEnum.digifranchise_super_admin)
//     @ApiOperation({ summary: 'CREATE - Create Digifranchise' })
//     @Post('create')
//     async createDigifranchise(
//       @Req() req: Request,
//       @Body() createDigifranchiseDto: CreateDigifranchiseDto,
//     ): Promise<Digifranchise> {
//       const userId = (req.user as UserEntity).id;
//       return this.digifranchiseService.createDigifranchise(userId, createDigifranchiseDto);
//     }

//     @Roles()
//     @ApiOperation({ summary: 'CREATE - Get DigiFranchise by USER' })
//     @Get()
//     async getAllDigifranchises(
//       @Req() req: Request,
//     ): Promise<Digifranchise[]> {
//       const userId = (req.user as UserEntity).id
//       return this.digifranchiseService.getAllDigifranchiseByUser(userId)
//     }
// }
