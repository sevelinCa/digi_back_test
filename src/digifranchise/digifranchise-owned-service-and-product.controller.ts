import { Controller, Post, Body, Param, UseGuards, Req, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { DigifranchiseOwnedServiceAndProductService } from './digifranchise-owned-service-and-product.service';
import { DigifranchiseOwnedServiceOffered } from './entities/digifranchise-owned-service-offered.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { DigifranchiseOwnedProduct } from './entities/digifranchise-owned-product.entity';

@ApiTags('Owned Digifranchise - Service')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'owned', version: '1' })
export class DigifranchiseOwnedServiceController {
   constructor(
      private readonly digifranchiseOwnedServiceAndProductService: DigifranchiseOwnedServiceAndProductService,
   ) { }

   @ApiOperation({ summary: 'CREATE - Select owned Service' })
   @ApiResponse({ status: HttpStatus.OK, description: 'Service Selected Successfull.' })
   @Post('select-owned-service/:ownerdServiceId')
   @HttpCode(HttpStatus.OK)
   async selectOwnedService(
      @Param('ownerdServiceId') ownerdServiceId: string,
   ): Promise<DigifranchiseOwnedServiceOffered> {

      return this.digifranchiseOwnedServiceAndProductService.selectOwnedService(ownerdServiceId);
   }

   @ApiOperation({ summary: 'GET ALL - Retrieve all Selected services' })
   @ApiResponse({ status: HttpStatus.OK, description: 'All Selected services  have been successfully retrieved.' })
   @Get('all-selected-services')
   @HttpCode(HttpStatus.OK)
   async getAllSelectedServices(): Promise<DigifranchiseOwnedServiceOffered[]> {
      return this.digifranchiseOwnedServiceAndProductService.getAllSelectedServices();
   }

 @ApiOperation({ summary: 'GET ALL - Retrieve all not Selected services' })
 @ApiResponse({ status: HttpStatus.OK, description: 'All not Selected services  have been successfully retrieved.' })
 @Get('all-not-selected-services')
 @HttpCode(HttpStatus.OK)
 async getAllNotSelectedServices(): Promise<DigifranchiseOwnedServiceOffered[]> {
    return this.digifranchiseOwnedServiceAndProductService.getAllNotSelectedServices();
 }

 @ApiOperation({ summary: 'GET ALL - Retrieve all  services' })
 @ApiResponse({ status: HttpStatus.OK, description: 'All  services  have been successfully retrieved.' })
 @Get('all-services')
 @HttpCode(HttpStatus.OK)
 async getAllServices(): Promise<DigifranchiseOwnedServiceOffered[]> {
    return this.digifranchiseOwnedServiceAndProductService.getAllServices();
 }

}


@ApiTags('Owned Digifranchise - Product')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'owned', version: '1' })
export class DigifranchiseOwnedProductController {
 constructor(
    private readonly digifranchiseOwnedServiceAndProductService: DigifranchiseOwnedServiceAndProductService,
 ) {}

 @ApiOperation({ summary: 'CREATE - Select owned Product' })
 @ApiResponse({ status: HttpStatus.OK, description: 'Product Selected Successfull.' })
 @Post('select-owned-product/:ownerdProductId')
 @HttpCode(HttpStatus.OK)
 async selectOwnedProduct(
   @Param('ownerdProductId') ownerdProductId: string,
 ): Promise<DigifranchiseOwnedProduct> {

   return this.digifranchiseOwnedServiceAndProductService.selectOwnedProduct(ownerdProductId);
 }

 @ApiOperation({ summary: 'GET ALL - Retrieve all Selected products' })
 @ApiResponse({ status: HttpStatus.OK, description: 'All Selected products  have been successfully retrieved.' })
 @Get('all-selected-products')
 @HttpCode(HttpStatus.OK)
 async getAllSelectedProducts(): Promise<DigifranchiseOwnedProduct[]> {
    return this.digifranchiseOwnedServiceAndProductService.getAllSelectedProducts();
 }

}