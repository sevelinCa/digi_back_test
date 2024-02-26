import { Body, Controller, Post, Req, UseGuards, NotFoundException, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { DigifranchiseService } from './digifranchise.service';
import type { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import type { FranchiseOwnership } from './entities/franchise-ownership.entity';
import type { DigifranchiseServiceOfferedService } from './digifranchiseService-offered.service';

@ApiTags('Digifranchise')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise', version: '1' })
export class DigifranchiseController {
    constructor(private readonly digifranchiseService: DigifranchiseService) {}



    @Roles(RoleEnum.digifranchise_super_admin)
    @ApiOperation({ summary: 'CREATE - Create Digifranchise Account' })
    @Post('create-account')
    async createDigifranchiseAccount(
      @Req() req: Request,
     ): Promise<FranchiseOwnership> {
      const userId = (req.user as UserEntity).id;
      const firstName = (req.user as UserEntity).firstName;
      const lastName = (req.user as UserEntity).lastName;
      const userFullNames = `${firstName} ${lastName}`;
      const digifranchiseId = '';
  
      try {
        return await this.digifranchiseService.createDigifranchiseAccount(userId, userFullNames, digifranchiseId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new NotFoundException('Failed to create Digifranchise account');
      }
    }
    
    // @Roles(RoleEnum.digifranchise_super_admin)
    // @ApiOperation({ summary: 'CREATE - Create Digifranchise' })
    // @Post('create')
    // async createDigifranchise(
    //   @Req() req: Request,
    //   @Body() createDigifranchiseDto: CreateDigifranchiseDto,
    // ): Promise<FranchiseOwnership> {
    //   const userId = (req.user as UserEntity).id;
    //   return this.digifranchiseService.createDigifranchiseAccount(userId, createDigifranchiseDto.userFullNames, createDigifranchiseDto.digifranchiseId);
    // }

    // @Get('active-digifranchises')
    // async findAllActiveDigifranchises() {
    //   return await this.digifranchiseService.findAllActiveDigifranchises();
    // }
}


@ApiTags('Digifranchise Services')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise services', version: '1' })
export class DigifranchiseServiceOfferController {
  constructor(private readonly digifranchiseServiceOffer: DigifranchiseServiceOfferedService) {}

  @Get('active-services')
  async findAllActiveDigifranchiseServices() {
    return await this.digifranchiseServiceOffer.findAllActiveDigifranchiseServices();
  }

  @Get('digifranchises-with-services')
  async findAllDigifranchisesWithServices() {
    return await this.digifranchiseServiceOffer.findAllDigifranchisesWithServices();
  }
}

