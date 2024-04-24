import { Controller, Post, Body, Param, HttpStatus, HttpException, Get, Delete, NotFoundException, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto } from './dto/availability.dto';
import { AvailabilitySlotsDetails, type AvailabilityDayTime, type Unavailability } from './entities/availability.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@ApiTags('NEW AVAILABILITY')
@Controller({ path: 'availability', version: '1' })
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) { }


    @ApiOperation({ summary: 'Create New Availability' })
    @ApiResponse({ status: HttpStatus.OK, description: 'New availability created.' })
    @ApiBody({ type: AvailabilityDto })
    @Post('new-availability/:ownedFranchiseId')
    async createAvailability(
        @Param('ownedFranchiseId') ownedFranchiseId: string,

        @Body() availabilityDto: AvailabilityDto
    ): Promise<any> {
        return await this.availabilityService.createAvailability(availabilityDto, ownedFranchiseId);
    }

}

