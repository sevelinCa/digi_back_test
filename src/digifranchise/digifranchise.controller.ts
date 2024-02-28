import { Body, Controller, Post, Req, UseGuards, NotFoundException, Get, HttpCode, HttpStatus, Param, Delete, Put, Query, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { DigifranchiseService } from './digifranchise.service';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { CreateDigifranchiseDto } from './dto/create-digifranchise.dto';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service.entity';
import { CreateDigifranchiseServiceOfferedDto, UpdateDigifranchiseServiceOfferedDto } from './dto/create-digifranchiseServiceOffered.dto';
import { DigifranchiseGeneralInfoService } from './digifranchise-general-information.service';
import { DigifranchiseSubServices } from './entities/digifranchise-sub-service.entity';
import { CreateDigifranchiseSubServiceOfferedDto, UpdateDigifranchiseSubServiceDto } from './dto/create-digifranchise-SubServiceOffered.dto';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { ProductService } from './product.service';
import { CreateDigifranchiseSubProductDto } from './dto/create-digifranchise-SubProduct.dto';
import type { DigifranchiseSubProduct } from './entities/digifranchise-sub-product.entity';

@ApiTags('Digifranchise')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise', version: '1' })
export class DigifranchiseController {
  constructor(
    private readonly digifranchiseService: DigifranchiseService,
    private readonly digifranchiseGeneralInfoService: DigifranchiseGeneralInfoService
  ) { }



  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Digifranchises' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Digifranchise have been successfully retrieved.' })
  @Get('get-all-digifranchise')
  @HttpCode(HttpStatus.OK)
  async findAllDigifranchise(): Promise<Digifranchise[]> {
    return this.digifranchiseService.findAllDigifranchise();
  }

  @Post('own-digifranchise/:digifranchiseId')
  @HttpCode(HttpStatus.OK)
  async ownDigifranchise(
    @Req() req: Request,
    @Param('digifranchiseId') digifranchiseId: string,
  ): Promise<DigifranchiseOwner> {
    const userId = (req.user as UserEntity).id;
  
    try {
      return await this.digifranchiseService.ownDigifranchise(userId, digifranchiseId);
    } catch (error) {
      if (error.message === 'User already own this digifranchise') {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'User already own this digifranchise',
        }, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error',
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
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
}


@ApiTags('Digifranchise Service')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise-service', version: '1' })
export class DigifranchiseServiceOfferedController {
  constructor(
    private readonly digifranchiseService: DigifranchiseService,
    private readonly digifranchiseGeneralInfoService: DigifranchiseGeneralInfoService
  ) { }



  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Digifranchise products  by Digifranchise ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Digifranchise products  by the specified Digifranchise ID have been successfully retrieved.' })
  @Get('get-products/:digifranchiseId')
  @HttpCode(HttpStatus.OK)
  async findAllByDigifranchiseId(@Param('digifranchiseId') digifranchiseId: string): Promise<DigifranchiseServiceOffered[]> {
    return this.digifranchiseService.findAllByDigifranchiseId(digifranchiseId);
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


  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET - Get general information of the digifranchise' })
  @Get('get-general-info')
  @HttpCode(HttpStatus.OK)
  async getDigifranchiseGeneralInfo(@Req() req: Request, @Query('ownedDigifranchiseId') ownedDigifranchiseId: string): Promise<void> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseGeneralInfoService.getDigifranchiseGeneralInformation(userId, ownedDigifranchiseId);
  }

}


@ApiTags('Digifranchise Product')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise-product', version: '1' })
export class DigifranchiseProductController {
  constructor(
    private readonly roductService: ProductService,
  ) { }



  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Digifranchise products  by Digifranchise ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Digifranchise products  by the specified Digifranchise ID have been successfully retrieved.' })
  @Get('get-products/:digifranchiseId')
  @HttpCode(HttpStatus.OK)
  async findAllProductByDigifranchiseId(@Param('digifranchiseId') digifranchiseId: string): Promise<DigifranchiseProduct[]> {
    return this.roductService.findAllProductByDigifranchiseId(digifranchiseId);
  }
  

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'CREATE - Create Sub Product' })
  @ApiResponse({ status: HttpStatus.OK, description: 'You have created sub product.' })
  @ApiBody({ type: CreateDigifranchiseSubProductDto })
  @Post('create-sub-product/:productId')
  @HttpCode(HttpStatus.OK)
  async createSubDigifranchiseProduct(
    @Body() createDigifranchiseSubProductDto: CreateDigifranchiseSubProductDto,
    @Req() req: Request,
    @Param('productId') productId: string,
  ): Promise<DigifranchiseSubProduct> {
    const userId = (req.user as UserEntity).id;
  
    return this.roductService.createSubDigifranchiseProduct(createDigifranchiseSubProductDto, userId, productId);
  }

  // @Roles(RoleEnum.digifranchise_super_admin)
  // @ApiOperation({ summary: 'GET ALL - Retrieve all Sub products' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'All Sub products  have been successfully retrieved.' })
  // @Get('get-all-sub-products')
  // @HttpCode(HttpStatus.OK)
  // async getAllSubService(@Req() req: Request): Promise<DigifranchiseSubServices[]> {
  //   const userId = (req.user as UserEntity).id;
  //   return this.digifranchiseService.getAllSubService(userId);
  // }

  // @Roles(RoleEnum.digifranchise_super_admin)
  // @ApiOperation({ summary: 'GET ONE - Retrieve a Sub product by ID' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Sub service  has been successfully retrieved.' })
  // @Get('get-sub-service/:id')
  // @HttpCode(HttpStatus.OK)
  // async getOneSubServiceById(@Req() req: Request, @Param('id') id: string): Promise<DigifranchiseSubServices> {
  //   const userId = (req.user as UserEntity).id;
  //   return this.digifranchiseService.getOneSubServiceById(userId, id);
  // }

  // @Roles(RoleEnum.digifranchise_super_admin)
  // @ApiOperation({ summary: 'UPDATE - Update a sub service  by ID' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Sub service has been successfully updated.' })
  // @ApiBody({ type: UpdateDigifranchiseSubServiceDto })
  // @Put('update-sub-service/:id')
  // @HttpCode(HttpStatus.OK)
  // async updateSubService(
  //   @Req() req: Request,
  //   @Param('id') id: string,
  //   @Body() updateDigifranchiseSubServiceDto: UpdateDigifranchiseSubServiceDto,
  // ): Promise<DigifranchiseSubServices> {
  //   const userId = (req.user as UserEntity).id;
  //   return this.digifranchiseService.updateSubService(userId, id, updateDigifranchiseSubServiceDto);
  // }


  // @Roles(RoleEnum.digifranchise_super_admin)
  // @ApiOperation({ summary: 'DELETE - Delete a Sub service  by ID' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Sub service has been successfully deleted.' })
  // @Delete('delete-sub-service/:id')
  // @HttpCode(HttpStatus.OK)
  // async deleteSubService(@Req() req: Request, @Param('id') id: string): Promise<void> {
  //   const userId = (req.user as UserEntity).id;
  //   return this.digifranchiseService.deleteSubService(userId, id);
  // }


}

