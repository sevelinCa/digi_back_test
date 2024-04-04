import { Controller, Get, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DigifranchiseSelectServiceService, DigifranchiseSelectProductService } from './digifranchise-select-item.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseSelectProductOrServiceTable } from './entities/digifranchise-select-product-service.entity';
import { Request } from 'express';

@ApiTags('Digifranchise - SELECT SERVICE')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'select-service', version: '1' })
export class DigifranchiseSelectItemServiceController {

    constructor(private readonly digifranchiseSelectServiceService: DigifranchiseSelectServiceService) { }


    @ApiOperation({ summary: 'SELECT - Check or Uncheck item', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Item selected.' })
    @Post('select-item/:ownerDigifranchiseId/:digifranchiseServiceId')
    async selectOrUnselectService(
        @Req() req: Request,
        @Param('ownerDigifranchiseId') ownerDigifranchiseId: string,
        @Param('digifranchiseServiceId') digifranchiseServiceId: string,
    ): Promise<DigifranchiseSelectProductOrServiceTable> {
        const userId = (req.user as UserEntity).id;
        return this.digifranchiseSelectServiceService.selectOrUnselectService(ownerDigifranchiseId, digifranchiseServiceId, userId);
    }

    @ApiOperation({ summary: 'Retrieve all selected services' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All selected services retrieved successfully.', type: [DigifranchiseSelectProductOrServiceTable] })
    @Get('get-all-select-services')
    async getAllSelectedServices(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
        return this.digifranchiseSelectServiceService.getAllSelectedServices();
    }
}

@ApiTags('Digifranchise - SELECT PRODUCT')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'select-product', version: '1' })
export class DigifranchiseSelectItemProductController {

    constructor(private readonly digifranchiseSelectProductService: DigifranchiseSelectProductService) { }


    @ApiOperation({ summary: 'SELECT - Check or Uncheck item', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Item selected.' })
    @Post('select-item/:digifranchiseOwnedId/:digifranchiseProductId')
    async selectOrUnselectProduct(
        @Req() req: Request,
        @Param('digifranchiseOwnedId') digifranchiseOwnedId: string,
        @Param('digifranchiseProductId') digifranchiseProductId: string,
    ): Promise<DigifranchiseSelectProductOrServiceTable> {
        const userId = (req.user as UserEntity).id;
        return this.digifranchiseSelectProductService.selectOrUnselectProduct(digifranchiseOwnedId, digifranchiseProductId, userId);
    }

    // @ApiOperation({ summary: 'Retrieve all selected services' })
    // @ApiResponse({ status: HttpStatus.OK, description: 'All selected services retrieved successfully.', type: [DigifranchiseSelectProductOrServiceTable] })
    // @Get()
    // async getAllSelectedServices(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
    //     return this.digifranchiseSelectProductService.getAllSelectedServices();
    // }
}

