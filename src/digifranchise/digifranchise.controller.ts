import { Body, Controller, Post, Req, UseGuards, NotFoundException, Get, HttpCode, HttpStatus, Param, Delete, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { DigifranchiseService } from './digifranchise.service';
import type { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import type { FranchiseOwner } from './entities/franchise-ownership.entity';
import type { CreateDigifranchiseDto } from './dto/create-digifranchise.dto';
import type { Digifranchise } from './entities/digifranchise.entity';
import type { DigifranchiseServiceOffered } from './entities/digifranchise-service.entity';
import { CreateDigifranchiseServiceOfferedDto, UpdateDigifranchiseServiceOfferedDto } from './dto/create-digifranchiseServiceOffered.dto';

@ApiTags('Digifranchise')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise', version: '1' })
export class DigifranchiseController {
  constructor(private readonly digifranchiseService: DigifranchiseService) { }



  // @Roles(RoleEnum.digifranchise_super_admin)
  // @ApiOperation({ summary: 'CREATE - Create Main Digifranchise service' })
  // @ApiResponse({ status: HttpStatus.CREATED, description: 'The main Digifranchise has been successfully created.' })
  // @Post('create-new-digifranchise')
  // @HttpCode(HttpStatus.CREATED)
  // async createMainDigifranchiseService(
  //   @Body() createDigifranchiseDto: CreateDigifranchiseDto,
  //  ): Promise<Digifranchise> {
  //   return this.digifranchiseService.createMainDigifranchiseService(createDigifranchiseDto);
  // }


  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Digifranchise services' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Digifranchise services have been successfully retrieved.' })
  @Get('get-all-digifranchise')
  @HttpCode(HttpStatus.OK)
  async findAllDigifranchise(): Promise<Digifranchise[]> {
    return this.digifranchiseService.findAllDigifranchise();
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Digifranchise services offered by Digifranchise ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Digifranchise services offered by the specified Digifranchise ID have been successfully retrieved.' })
  @Get('get-services/:digifranchiseId')
  @HttpCode(HttpStatus.OK)
  async findAllByDigifranchiseId(@Param('digifranchiseId') digifranchiseId: string): Promise<DigifranchiseServiceOffered[]> {
    return this.digifranchiseService.findAllByDigifranchiseId(digifranchiseId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'CREATE - Own digifranchise' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'You have owned degifranchise.' })
  @Post('own-digifranchise:digifranchiseId')
  @HttpCode(HttpStatus.CREATED)
  async ownDigifranchise(
    @Req() req: Request,
    @Param('digifranchiseId') digifranchiseId: string,
  ): Promise<FranchiseOwner> {
    const userId = (req.user as UserEntity).id;
    const firstName = (req.user as UserEntity).firstName;
    const lastName = (req.user as UserEntity).lastName;
    const userFullNames = `${firstName} ${lastName}`;
    const role = (req.user as UserEntity).role;


    const roleId = role ? role.id.toString() : '';

    return this.digifranchiseService.ownDigifranchise(userId, userFullNames, roleId, digifranchiseId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Digifranchises owned by the user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Digifranchises owned by the user have been successfully retrieved.' })
  @Get('get-owned-digifranchises')
  @HttpCode(HttpStatus.OK)
  async findAllOwnedDigifranchise(@Req() req: Request): Promise<Digifranchise[]> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseService.findAllOwnedDigifranchiseByUserId(userId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'CREATE - Create Sub Service' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'You have created subservice.' })
  @ApiBody({ type: CreateDigifranchiseServiceOfferedDto })
  @Post('create-sub-service/:digifranchiseId')
  @HttpCode(HttpStatus.CREATED)
  async createSubDigifranchiseServiceOffered(
    @Body() createDigifranchiseServiceOfferedDto: CreateDigifranchiseServiceOfferedDto,
    @Req() req: Request,
    @Param('digifranchiseId') digifranchiseId: string,
  ): Promise<DigifranchiseServiceOffered> {
    const userId = (req.user as UserEntity).id;

    return this.digifranchiseService.createSubDigifranchiseServiceOffered(createDigifranchiseServiceOfferedDto, userId, digifranchiseId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Sub services' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Sub services  have been successfully retrieved.' })
  @Get('get-all-sub-services')
  @HttpCode(HttpStatus.OK)
  async getAllDigifranchiseServiceOffered(@Req() req: Request): Promise<DigifranchiseServiceOffered[]> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseService.getAllDigifranchiseServiceOffered(userId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ONE - Retrieve a Sub service by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Digifranchise service offered has been successfully retrieved.' })
  @Get('get-sub-service/:id')
  @HttpCode(HttpStatus.OK)
  async getOneDigifranchiseServiceOffered(@Req() req: Request, @Param('id') id: string): Promise<DigifranchiseServiceOffered> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseService.getOneDigifranchiseServiceOffered(userId, id);
  }

}


