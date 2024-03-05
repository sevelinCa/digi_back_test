import { Body, Controller, Get, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateVenueDto, UpdateVenueDto } from './dto/create-venues.dto';
import { CalenderMgtService } from './calender-mgt.service';
import { CalenderVenue } from './entities/calender-venues.entity';
import { CreateEventDto, } from './dto/create-events.dto';
import { CalenderEvents } from './entities/calender-events.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import { CalenderBooking } from './entities/calender-bookings.entity';
import { CreateBookingDto } from './dto/create-bookings.dto';
import { CalenderEventOwner } from './entities/calender-event-owner.entity';

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

    @ApiOperation({ summary: 'CREATE - Create - Event', })
    @ApiResponse({ status: HttpStatus.OK, description: 'You have created Venue.' })
    @ApiBody({ type: CreateEventDto })

    @Post('create-event')
    async createEvent(
        @Req() req: Request,
        @Param('venueId') venueId: string,
        @Body() createEventDto: CreateEventDto): Promise<CalenderEvents> {
        const userId = (req.user as UserEntity).id;

        return this.calenderMgtService.createEvent(userId, venueId, createEventDto);
    }

    @ApiOperation({ summary: 'CREATE - Record - Booking', })
    @ApiResponse({ status: HttpStatus.OK, description: 'You have recorded a new booking.' })
    @ApiBody({ type: CreateBookingDto })
    @Post('record-booking')
    async recordBooking(
        @Req() req: Request,
        @Param('eventId') eventId: string,
        @Body() createBookingDto: CreateBookingDto
    ): Promise<CalenderBooking> {
        const userId = (req.user as UserEntity).id;

        return this.calenderMgtService.recordBooking(userId, eventId, createBookingDto)
    }


    @ApiOperation({ summary: 'GET ALL - Retrieve all venues' })
    @Get('venues')
    async getAllVenues(): Promise<CalenderVenue[]> {
        return this.calenderMgtService.getAllVenues();
    }

    @ApiOperation({ summary: 'GET ALL - Retrieve all events' })
    @Get('events')
    async getAllEvents(): Promise<CalenderEvents[]> {
        return this.calenderMgtService.getAllEvents();
    }


    @ApiOperation({ summary: 'GET ALL - Retrieve all bookings' })
    @Get('bookings')
    async getAllBookings(): Promise<CalenderBooking[]> {
        return this.calenderMgtService.getAllBookings();
    }


    @ApiOperation({ summary: 'GET ALL - Retrieve all event owners' })
    @Get('event-owners')
    async getAllEventOwners(): Promise<CalenderEventOwner[]> {
        return this.calenderMgtService.getAllEventOwners();
    }

    @ApiOperation({ summary: 'GET ONE - Retrieve venue by ID' })
    @Get('venues/:venueId')
    async getVenueById(@Param('venueId') venueId: string): Promise<CalenderVenue | null> {
        return this.calenderMgtService.getVenueById(venueId);
    }

    @ApiOperation({
        summary: 'UPDATE - Update venue by ID',
    })
    @ApiBody({ type: UpdateVenueDto })
    @Put('venues/:venueId')
    async updateVenue(
        @Param('venueId') venueId: string,
        @Body() updateVenueDto: UpdateVenueDto
    ): Promise<CalenderVenue> {
        return this.calenderMgtService.updateVenue(venueId, updateVenueDto);
    }

// NEW 
    @ApiOperation({
        summary: 'GET ONE - Retrieve event by ID',
    })
    @Get('events/:eventId')
    async getEventById(@Param('eventId') eventId: string): Promise<CalenderEvents | null> {
        return this.calenderMgtService.getEventById(eventId);
    }
}
