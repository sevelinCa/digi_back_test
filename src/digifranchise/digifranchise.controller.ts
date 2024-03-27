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
import { DigifranchiseServiceOffered } from './entities/digifranchise-service-offered.entity';
import { CreateDigifranchiseServiceOfferedDto, UpdateDigifranchiseServiceOfferedDto } from './dto/create-digifranchiseServiceOffered.dto';
import { DigifranchiseGeneralInfoService } from './digifranchise-general-information.service';
import { DigifranchiseSubServices } from './entities/digifranchise-sub-service.entity';
import { CreateDigifranchiseSubServiceOfferedDto, UpdateDigifranchiseSubServiceDto } from './dto/create-digifranchise-SubServiceOffered.dto';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { ProductService } from './product.service';
import { CreateDigifranchiseSubProductDto, UpdateDigifranchiseSubProductDto } from './dto/create-digifranchise-SubProduct.dto';
import type { DigifranchiseSubProduct } from './entities/digifranchise-sub-product.entity';
import { DigifranchiseGeneralInfo } from './entities/digifranchise-general-information.entity';
import { UpdateDigifranchiseGeneralInfoDto } from './dto/update-digifranchise-general-info.dto';
import { UpdateDigifranchiseComplianceInfoDto } from './dto/update-digifranchise-compliance-info.dto';
import { DigifranchiseComplianceInfoService } from './digifranchise-compliance-information.service';
import { DigifranchiseComplianceInfo } from './entities/digifranchise-compliance-information.entity';
import { DigifranchiseProfessionalBodyMembershipService } from './digranchise-professional-body-membership.service';
import { DigifranchiseProfessionalBodyMembership } from './entities/digifranchise-professional-body-membership.entity';
import { AddProfessionalMembershipDto } from './dto/add-digifranchise-professional-membership.dto';
import type { DigifranchiseServiceCategory } from './entities/digifranchise-service-category.entity';

@ApiTags('Digifranchise')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise', version: '1' })
export class DigifranchiseController {
  constructor(
    private readonly digifranchiseService: DigifranchiseService,
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
      // console.log('>>>>>>', error)
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
  async findAllOwnedDigifranchise(@Req() req: Request): Promise<DigifranchiseOwner[]> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseService.findAllOwnedDigifranchiseByUserId(userId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET - Retrieve a single Digifranchise owned by the user by its ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The Digifranchise owned by the user has been successfully retrieved.' })
  @Get('get-one-owned-digifranchise/:digifranchiseId')
  @HttpCode(HttpStatus.OK)
  async findOneOwnedDigifranchise(@Req() req: Request, @Param('digifranchiseId') digifranchiseId: string): Promise<DigifranchiseOwner | null> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseService.findOneOwnedDigifranchiseByUserId(userId, digifranchiseId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET - Retrieve Digifranchise by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Digifranchise has been successfully retrieved.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Digifranchise not found.' })
  @Get('get-one-digifranchise/:digifranchiseId')
  async getDigifranchiseByDigifranchiseId(@Param('digifranchiseId') digifranchiseId: string): Promise<Digifranchise> {
    const digifranchiseOwner = await this.digifranchiseService.getDigifranchiseByDigifranchiseId(digifranchiseId);
    if (!digifranchiseOwner) {
      throw new NotFoundException('Digifranchise not found');
    }
    return digifranchiseOwner;
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'CREATE - Create a new Digifranchise' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'A new Digifranchise has been successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @Post('create-digifranchise')
  @HttpCode(HttpStatus.CREATED)
  async createDigifranchise(@Body() createDigifranchiseDto: CreateDigifranchiseDto): Promise<Digifranchise> {
    return this.digifranchiseService.createDigifranchise(createDigifranchiseDto);
  }
}

@ApiTags('Digifranchise Optional - Endpoint')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise-optional-endpoint', version: '1' })
export class DigifranchiseOptionEndpoint {
  constructor(
    private readonly digifranchiseService: DigifranchiseService,
  ) { }

  @Get('service-category/:serviceCategoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'GET - Retrieve a service category by its ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Service category has been successfully retrieved.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Service category not found.' })
  async getDigifranchiseServiceCategoryById(@Param('serviceCategoryId') serviceCategoryId: string): Promise<DigifranchiseServiceCategory> {
    const category = await this.digifranchiseService.getDigifranchiseServiceCategoryById(serviceCategoryId);
    if (!category) {
      throw new NotFoundException(`DigifranchiseServiceCategory with ID ${serviceCategoryId} not found`);
    }
    return category;
  }

  @Get('service-offered/:serviceOfferedId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'GET - Retrieve a service offered by its ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Service offered has been successfully retrieved.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Service offered not found.' })
  async getDigifranchiseServiceOfferedById(@Param('serviceOfferedId') serviceOfferedId: string): Promise<DigifranchiseServiceOffered> {
    const serviceOffered = await this.digifranchiseService.getDigifranchiseServiceOfferedById(serviceOfferedId);
    if (!serviceOffered) {
      throw new NotFoundException(`DigifranchiseServiceOffered with service Id ${serviceOfferedId} not found`);
    }
    return serviceOffered;
  }

  @Get('product/:productId')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'GET - Retrieve a product by its ID' })
@ApiResponse({ status: HttpStatus.OK, description: 'Product has been successfully retrieved.' })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found.' })
async getDigifranchiseProductById(@Param('productId') productId: string): Promise<DigifranchiseProduct> {
 const product = await this.digifranchiseService.getDigifranchiseProductById(productId);
 if (!product) {
    throw new NotFoundException(`DigifranchiseProduct with ID ${productId} not found`);
 }
 return product;
}

}