import { Body, Controller, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEventDto } from 'src/calender-mgt/dto/create-events.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { CreateAvailabilityManagementDto } from './dto/create-availability-management.dto';
import { AvailableManagement } from './entities/available-management.entity';
import { Request } from 'express';
import { AvailabilityManagementService } from './availability-management.service';

@ApiTags('Availability managment')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'availability-mgt', version: '1' })
export class AvailabilityManagmentController {
    constructor(private readonly availabilityManagementService: AvailabilityManagementService) { }



    @ApiOperation({ summary: 'CREATE - Create - Availability', })
    @ApiResponse({ status: HttpStatus.OK, description: 'You have created Availability.' })
    @ApiBody({ type: CreateAvailabilityManagementDto })
    @Post('create-availability/:digifranchiseId')
    async createAvailability(
        @Req() req: Request,
        @Param('digifranchiseId') digifranchiseId : string,
        @Body() createAvailabilityManagementDto: CreateAvailabilityManagementDto): Promise<AvailableManagement> {
        const userId = (req.user as UserEntity).id;

        return this.availabilityManagementService.createAvailability(userId, digifranchiseId, createAvailabilityManagementDto);
    }

}
