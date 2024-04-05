import { Body, Controller, Post, Req, UseGuards, NotFoundException, Get, HttpCode, HttpStatus, Param, Delete, Put, Query, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { DigifranchiseService } from './digifranchise.service';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service-offered.entity';
import { DigifranchiseSubServices } from './entities/digifranchise-sub-service.entity';
import { CreateDigifranchiseSubServiceOfferedDto, UpdateDigifranchiseSubServiceDto } from './dto/create-digifranchise-SubServiceOffered.dto';

@ApiTags('Digifranchise Service')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise-service', version: '1' })
export class DigifranchiseServiceOfferedController {
  constructor(
    private readonly digifranchiseService: DigifranchiseService,
  ) { }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Digifranchise service  by Digifranchise ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Digifranchise service  by the specified Digifranchise ID have been successfully retrieved.' })
  @Get('get-all-services/:digifranchiseId')
  @HttpCode(HttpStatus.OK)
  async findAllServiceOfferedByDigifranchiseId(@Param('digifranchiseId') digifranchiseId: string): Promise<DigifranchiseServiceOffered[]> {
    return this.digifranchiseService.findAllServiceOfferedByDigifranchiseId(digifranchiseId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Digifranchise service by Digifranchise ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Digifranchise service by the specified Digifranchise ID have been successfully retrieved.' })
  @Get('get-all-services-with-subs/:digifranchiseId')
  @HttpCode(HttpStatus.OK)
  async getServicesAndSubServicesByDigifranchiseId(
   @Req() req: Request,
   @Param('digifranchiseId') digifranchiseId: string,
  ): Promise<DigifranchiseServiceOffered[]> {
   const userId = (req.user as UserEntity).id; // Assuming the user object is attached to the request and contains an 'id' property
   return this.digifranchiseService.getServicesAndSubServicesByDigifranchiseId(digifranchiseId, userId);
  }


  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'CREATE - Create Sub Service' })
  @ApiResponse({ status: HttpStatus.OK, description: 'You have created subservice.' })
  @ApiBody({ type: CreateDigifranchiseSubServiceOfferedDto })
  @Post('create-sub-service/:serviceId')
  @HttpCode(HttpStatus.OK)
  async createSubDigifranchiseServiceOffered(
    @Body() createDigifranchiseSubServiceOfferedDto: CreateDigifranchiseSubServiceOfferedDto,
    @Req() req: Request,
    @Param('serviceId') serviceId: string,
  ): Promise<DigifranchiseSubServices> {
    const userId = (req.user as UserEntity).id;

    return this.digifranchiseService.createSubDigifranchiseServiceOffered(createDigifranchiseSubServiceOfferedDto, userId, serviceId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Sub products' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Sub products  have been successfully retrieved.' })
  @Get('get-all-sub-products')
  @HttpCode(HttpStatus.OK)
  async getAllSubService(@Req() req: Request): Promise<DigifranchiseSubServices[]> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseService.getAllSubService(userId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ONE - Retrieve a Sub service by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sub service  has been successfully retrieved.' })
  @Get('get-sub-service/:id')
  @HttpCode(HttpStatus.OK)
  async getOneSubServiceById(@Req() req: Request, @Param('id') id: string): Promise<DigifranchiseSubServices> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseService.getOneSubServiceById(userId, id);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'UPDATE - Update a sub service  by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sub service has been successfully updated.' })
  @ApiBody({ type: UpdateDigifranchiseSubServiceDto })
  @Put('update-sub-service/:id')
  @HttpCode(HttpStatus.OK)
  async updateSubService(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateDigifranchiseSubServiceDto: UpdateDigifranchiseSubServiceDto,
  ): Promise<DigifranchiseSubServices> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseService.updateSubService(userId, id, updateDigifranchiseSubServiceDto);
  }


  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'DELETE - Delete a Sub service  by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sub service has been successfully deleted.' })
  @Delete('delete-sub-service/:id')
  @HttpCode(HttpStatus.OK)
  async deleteSubService(@Req() req: Request, @Param('id') id: string): Promise<void> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseService.deleteSubService(userId, id);
  }
}