import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAvailabilityManagementDto, UpdateAvailabilityManagementDto } from './dto/create-availability-management.dto';
import { AvailableManagement } from './entities/available-management.entity';
import { Request } from 'express';
import { AvailabilityManagementService } from './availability-management.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@ApiTags('Availability Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'availability-mgt', version: '1' })
export class AvailabilityManagementController {
    constructor(private readonly availabilityManagementService: AvailabilityManagementService) { }

    @ApiOperation({ summary: 'CREATE - Create - Availability', })
    @ApiResponse({ status: HttpStatus.OK, description: 'You have created Availability.' })
    @ApiBody({ type: CreateAvailabilityManagementDto })
    @Post('create-availability/:digifranchiseId')
    async createAvailability(
        @Req() req: Request,
        @Param('digifranchiseId') digifranchiseId: string,
        @Body() createAvailabilityManagementDto: CreateAvailabilityManagementDto): Promise<AvailableManagement> {
        const userId = (req.user as UserEntity).id;
        return this.availabilityManagementService.createAvailability(userId, digifranchiseId, createAvailabilityManagementDto);
    }

    @ApiOperation({ summary: 'GET - Get All Availabilities', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved all availabilities.' })
    @Get('get-all-availabilities')
    async getAllAvailability(): Promise<AvailableManagement[]> {
        return this.availabilityManagementService.getAllAvailability();
    }

    @ApiOperation({ summary: 'GET - Get Availability by ID', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved availability by ID.' })
    @Get('get-one-availability/:availabilityId')
    async getOneAvailabiltyById(@Param('availabilityId') availabilityId: string): Promise<AvailableManagement | null> {
        return this.availabilityManagementService.getOneAvailabiltyById(availabilityId);
    }


}