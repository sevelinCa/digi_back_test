import { Controller, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
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
@Controller({ path: 'select-item', version: '1' })
export class DigifranchiseSelectItemController {

    constructor(private readonly digifranchiseSelectItemService: DigifranchiseSelectItemService) { }


    @ApiOperation({ summary: 'SELECT - Check or Uncheck item', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Item selected.' })
    @Post('select-item/:ownerDigifranchiseId/:digifranchiseServiceId')
    async selectOrUnselectService(
        @Req() req: Request,
        @Param('ownerDigifranchiseId') ownerDigifranchiseId: string,
        @Param('digifranchiseServiceId') digifranchiseServiceId: string,
    ): Promise<DigifranchiseSelectProductOrServiceTable> {
        const userId = (req.user as UserEntity).id;
        return this.digifranchiseSelectItemService.selectOrUnselectService(ownerDigifranchiseId, digifranchiseServiceId, userId);
    }
}
