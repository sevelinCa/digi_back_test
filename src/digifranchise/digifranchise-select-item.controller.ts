import { Controller, Get, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DigifranchiseSelectItemService } from './digifranchise-select-item.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseSelectProductOrServiceTable } from './entities/digifranchise-select-product-service.entity';
import { Request } from 'express';

@ApiTags('Digifranchise - SELECT ITEM')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'select-service', version: '1' })
export class DigifranchiseSelectItemController {

    constructor(private readonly digifranchiseSelectItemService: DigifranchiseSelectItemService) { }


    @ApiOperation({ summary: 'SELECT - Check or Uncheck service', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Service selected.' })
    @Post('select-item/:ownerDigifranchiseId/:digifranchiseServiceId')
    async selectOrUnselectService(
        @Req() req: Request,
        @Param('ownerDigifranchiseId') ownerDigifranchiseId: string,
        @Param('digifranchiseServiceId') digifranchiseServiceId: string,
    ): Promise<DigifranchiseSelectProductOrServiceTable> {
        const userId = (req.user as UserEntity).id;
        return this.digifranchiseSelectItemService.selectOrUnselectService(ownerDigifranchiseId, digifranchiseServiceId, userId);
    }


    @ApiOperation({ summary: 'SELECT - Check or Uncheck product', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Product selected.' })
    @Post('select-item/:digifranchiseOwnedId/:digifranchiseProductId')
    async selectOrUnselectProduct(
        @Req() req: Request,
        @Param('digifranchiseOwnedId') digifranchiseOwnedId: string,
        @Param('digifranchiseProductId') digifranchiseProductId: string,
    ): Promise<DigifranchiseSelectProductOrServiceTable> {
        const userId = (req.user as UserEntity).id;
        return this.digifranchiseSelectItemService.selectOrUnselectProduct(digifranchiseOwnedId, digifranchiseProductId, userId);
    }


    @ApiOperation({ summary: 'Retrieve all selected services' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All selected services retrieved successfully.', type: [DigifranchiseSelectProductOrServiceTable] })
    @Get('get-all-select-services')
    async getAllSelectedServices(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
        return this.digifranchiseSelectItemService.getAllSelectedServices();
    }

    @ApiOperation({ summary: 'Retrieve all unselected services' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All unselected services retrieved successfully.', type: [DigifranchiseSelectProductOrServiceTable] })
    @Get('get-all-unselect-services')
    async getAllUnSelectedServices(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
        return this.digifranchiseSelectItemService.getAllUnSelectedServices();
    }
}

