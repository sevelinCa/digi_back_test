import { Controller, Post, Body, Param, UseGuards, Req, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { DigifranchiseOwnedServiceAndProductService } from './digifranchise-owned-service-and-product.service';
import { DigifranchiseOwnedServiceOffered } from './entities/digifranchise-owned-service-offered.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import  { DigifranchiseOwnedProduct } from './entities/digifranchise-owned-product.entity';

@ApiTags('Owned Digifranchise - Service')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'owned', version: '1' })
export class DigifranchiseOwnedServiceController {
 constructor(
    private readonly digifranchiseOwnedServiceAndProductService: DigifranchiseOwnedServiceAndProductService,
 ) {}

 @ApiOperation({ summary: 'CREATE - Select owned Service' })
 @ApiResponse({ status: HttpStatus.OK, description: 'Service Selected Successfull.' })
 @Post('select-owned-service/:ownerdServiceId')
 @HttpCode(HttpStatus.OK)
 async selectOwnedService(
   @Param('ownerdServiceId') ownerdServiceId: string,
 ): Promise<DigifranchiseOwnedServiceOffered> {

   return this.digifranchiseOwnedServiceAndProductService.selectOwnedService(ownerdServiceId);
 }

}
