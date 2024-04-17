import { Controller, Post, Body, Param, HttpStatus, HttpException, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto } from './dto/availability.dto';

@ApiTags('NEW AVAILABILITY')
@Controller({ path: 'availability', version: '1' })
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) { }


    @ApiOperation({ summary: 'Create New Availability' })
    @ApiResponse({ status: HttpStatus.OK, description: 'New availability created.' })
    @ApiBody({ type: AvailabilityDto })
    @Post('new-availability/:ownedFranchiseId')
    async createNewAvailability(
        @Param('ownedFranchiseId') ownedFranchiseId: string,

        @Body() availabilityDto: AvailabilityDto
    ): Promise<any> {
        return await this.availabilityService.createNewAvailability(availabilityDto, ownedFranchiseId);
    }

    @ApiOperation({ summary: 'Get Available Availability' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Available availability retrieved.' })
    @Get('available-all-week-availability/:ownedFranchiseId')
    async getAvailableAvailability(@Param('ownedFranchiseId') ownedFranchiseId: string): Promise<any> {
        const availableAvailability = await this.availabilityService.getAvailableAvailability(ownedFranchiseId);
        return availableAvailability;
    }
}

