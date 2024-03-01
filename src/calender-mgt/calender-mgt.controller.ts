import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateVenueDto, UpdateVenueDto } from './dto/create-venues.dto';
import { CalenderMgtService } from './calender-mgt.service';
import { CalenderVenue } from './entities/calender-venues.entity';
import { CreateEventDto, UpdateEventDto } from './dto/create-events.dto';
import { CalenderEvents } from './entities/calender-events.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import type { CalenderBooking } from './entities/calender-bookings.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto/create-bookings.dto';
import type { CalenderEventOwner } from './entities/calender-event-owner.entity';
@ApiTags('Calender')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'calender', version: '1' })
export class CalenderMgtController {
    constructor(private readonly calenderMgtService: CalenderMgtService) { }

    @ApiOperation({ summary: 'CREATE - Create - Venue', })
    @ApiResponse({ status: HttpStatus.OK, description: 'You have created Venue.' })
    @ApiBody({ type: CreateVenueDto })
    @Post('create-venue')
    async createVenue(@Body() createVenueDto: CreateVenueDto): Promise<CalenderVenue> {
        return this.calenderMgtService.createVenue(createVenueDto);
    }




}
