import { Body, Controller, Delete, Get,Param,Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';

import { CreateRateDto, UpdateRateDto } from './dto/rate.dto';
import { RateTable } from './entities/rate.entity';
import { RateService } from './rate.service';

@ApiTags('rate')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'rate', version: '1' })
export class RateController {
    constructor(private readonly rateService: RateService) { }

    @ApiOperation({ summary: 'Create a new rate table' })
    @ApiResponse({ status: 201, description: 'Rate table has been successfully created.' })
    @ApiBody({ type: CreateRateDto })
    @Post('create-rate')
    async createRateTable(@Body() createRateDto: CreateRateDto): Promise<RateTable> {
        return this.rateService.createRateTable(createRateDto);
    }

}



