import { Body, Controller, Delete, Get, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateVenueDto, UpdateVenueDto } from './dto/create-venues.dto';
import { CalenderMgtService } from './calender-mgt.service';
import { CalenderVenue } from './entities/calender-venues.entity';
import { CreateEventDto, UpdateEventDto, } from './dto/create-events.dto';
import { CalenderEvents } from './entities/calender-events.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import { CalenderBooking } from './entities/calender-bookings.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto/create-bookings.dto';
import { CalenderEventOwner } from './entities/calender-event-owner.entity';
import { CalenderEventGuest } from './entities/calender-event-guest.entity';

@ApiTags('Calender')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'calender', version: '1' })
export class CalenderMgtController {
    constructor(private readonly calenderMgtService: CalenderMgtService) { }

    @ApiOperation({ summary: 'CREATE - Create - Venue', })
    @ApiResponse({ status: HttpStatus.OK, description: 'You have created Venue.' })
    @ApiBody({ type: CreateVenueDto })
    @Post('create-venue/:ownedFranchiseId')
    async createVenue(
        @Body() createVenueDto: CreateVenueDto,
        @Param('ownedFranchiseId') ownedFranchiseId: string,
    ): Promise<CalenderVenue> {
        return this.calenderMgtService.createVenue(createVenueDto, ownedFranchiseId);
    }

    @ApiOperation({ summary: 'CREATE - Create - Event', })
    @ApiResponse({ status: HttpStatus.OK, description: 'You have created Venue.' })
    @ApiBody({ type: CreateEventDto })

    @Post('create-event/:venueId')
    async createEvent(
        @Req() req: Request,
        @Param('venueId') venueId: string,
        @Body() createEventDto: CreateEventDto): Promise<CalenderEvents> {
        const userId = (req.user as UserEntity).id;

        return this.calenderMgtService.createEvent(userId, venueId, createEventDto);
    }

    @Get('events/guests')
    async getAllEventWithTheirGuest(): Promise<CalenderEvents[]> {
        return this.calenderMgtService.GetAllEventWithTheirGuest();
    }

    @Get('events/:eventId/guests')
    async getOneEventWithItsGuest(@Param('eventId') eventId: string): Promise<CalenderEvents | null> {
        return this.calenderMgtService.GetOneEventWithItsGuest(eventId);
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
    @Get('venues/:ownedFranchiseId')
    async getAllVenues(
        @Param('ownedFranchiseId') ownedFranchiseId: string,
    ): Promise<CalenderVenue[]> {
        return this.calenderMgtService.getAllVenues(ownedFranchiseId);
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

    @ApiOperation({
        summary: 'GET ONE - Retrieve event by ID',
    })
    @Get('events/:eventId')
    async getEventById(@Param('eventId') eventId: string): Promise<CalenderEvents | null> {
        return this.calenderMgtService.getEventById(eventId);
    }

    @ApiOperation({
        summary: 'GET ONE - Retrieve booking by ID',
    })
    @Get('bookings/:bookingId')
    async getBookingById(@Param('bookingId') bookingId: string): Promise<CalenderBooking | null> {
        return this.calenderMgtService.getBookingById(bookingId);
    }

    @ApiOperation({
        summary: 'GET ONE - Retrieve event owner by ID',
    })
    @Get('event-owners/:eventOwnerId')
    async getEventOwnerById(@Param('eventOwnerId') eventOwnerId: string): Promise<CalenderEventOwner | null> {
        return this.calenderMgtService.getEventOwnerById(eventOwnerId);
    }


    @ApiOperation({
        summary: 'UPDATE - Update event by ID',
    })
    @ApiBody({ type: UpdateEventDto })
    @Put('events/:eventId')
    async updateEvent(
        @Param('eventId') eventId: string,
        @Body() updateEventDto: UpdateEventDto
    ): Promise<CalenderEvents> {
        return this.calenderMgtService.updateEvent(eventId, updateEventDto);
    }


    @ApiOperation({
        summary: 'UPDATE - Update booking by ID',
    })
    @ApiBody({ type: UpdateBookingDto })
    @Put('bookings/:bookingId')
    async updateBooking(
        @Param('bookingId') bookingId: string,
        @Body() updateBookingDto: UpdateBookingDto
    ): Promise<CalenderBooking> {
        return this.calenderMgtService.updateBooking(bookingId, updateBookingDto);
    }

    @ApiOperation({
        summary: 'DELETE - Soft delete venue by ID',
    })
    @Delete('venues/:venueId')
    async deleteVenue(@Param('venueId') venueId: string): Promise<void> {
        return this.calenderMgtService.deleteVenue(venueId);
    }


    @ApiOperation({
        summary: 'DELETE - Soft delete event by ID',
    })
    @Delete('events/:eventId')
    async deleteEvent(@Param('eventId') eventId: string): Promise<void> {
        return this.calenderMgtService.deleteEvent(eventId);
    }

    @ApiOperation({
        summary: 'DELETE - Soft delete booking by ID',
    })
    @Delete('bookings/:bookingId')
    async deleteBooking(@Param('bookingId') bookingId: string): Promise<void> {
        return this.calenderMgtService.deleteBooking(bookingId);
    }

    @ApiOperation({
        summary: 'DELETE - Soft delete event owner by ID',
    })
    @Delete('event-owners/:eventOwnerId')
    async deleteEventOwner(@Param('eventOwnerId') eventOwnerId: string): Promise<void> {
        return this.calenderMgtService.deleteEventOwner(eventOwnerId);
    }


    @ApiOperation({
        summary: 'GET ALL - Retrieve all events by user ID',
    })
    @Get('events/user/:userId')
    async getAllEventsByUserId(@Param('userId') userId: string): Promise<CalenderEvents[]> {
        return this.calenderMgtService.getAllEventsByUserId(userId);
    }

    @ApiOperation({
        summary: 'GET ALL - Retrieve all events by venue ID',
    })
    @Get('events/venue/:venueId')
    async getAllEventsByVenueId(@Param('venueId') venueId: string): Promise<CalenderEvents[]> {
        return this.calenderMgtService.getAllEventsByVenueId(venueId);
    }


    @ApiOperation({
        summary: 'GET ALL - Retrieve all bookings by user ID',
    })
    @Get('bookings/user/:userId')
    async getAllBookingsByUserId(@Param('userId') userId: string): Promise<CalenderBooking[]> {
        return this.calenderMgtService.getAllBookingsByUserId(userId);
    }


    @ApiOperation({
        summary: 'GET ALL - Retrieve all bookings by event ID',
    })
    @Get('bookings/event/:eventId')
    async getAllBookingsByEventId(@Param('eventId') eventId: string): Promise<CalenderBooking[]> {
        return this.calenderMgtService.getAllBookingsByEventId(eventId);
    }


    @ApiOperation({ summary: 'Add a customer to an event' })
    @ApiResponse({ status: 201, description: 'The customer has been successfully added to the event.' })
    @Post('add-customer-to-event/:customerId/:eventId')
    async addCustomerToEvent(
        @Param('customerId') customerId: string,
        @Param('eventId') eventId: string,
    ): Promise<CalenderEventGuest> {
        return this.calenderMgtService.addCustomerToEvent(customerId, eventId);
    }

    @ApiOperation({ summary: 'Retrieve all customers for an event' })
    @ApiResponse({ status: 200, description: 'The list of customers for an event has been successfully retrieved.' })
    @Get('find-all-customers-for-event')
    async findAllCustomersForEvent(): Promise<CalenderEventGuest[]> {
        return this.calenderMgtService.findAllCustomersForEvent();
    }

    @ApiOperation({ summary: 'Retrieve a customer for an event by ID' })
    @ApiResponse({ status: 200, description: 'The customer for an event has been successfully retrieved.' })
    @Get('find-one-customer-for-event/:id')
    async findOneCustomerForEvenet(@Param('id') id: string): Promise<CalenderEventGuest | null> {
        return this.calenderMgtService.findOneCustomerForEvenet(id);
    }

    @ApiOperation({ summary: 'Remove a customer from an event' })
    @ApiResponse({ status: 204, description: 'The customer has been successfully removed from the event.' })
    @Delete('remove-customer-from-event/:id')
    async removeCustomerFromEvent(@Param('id') id: string): Promise<void> {
        return this.calenderMgtService.removeCustomerFromEvent(id);
    }

    @ApiOperation({ summary: 'DELETE - Remove a guest from a specific event by ID' })
    @ApiResponse({ status: 204, description: 'The guest has been successfully removed from the specified event.' })
    @Delete('remove-guest-from-event/:guestId/events/:eventId')
    async removeGuestFromEvent(@Param('guestId') guestId: string, @Param('eventId') eventId: string): Promise<void> {
        try {
            await this.calenderMgtService.removeGuestFromEvent(guestId, eventId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException('An error occurred while removing the guest from the event.');
        }
    }
}



@ApiTags('Calender - VENUE NO AUTH')
@Controller({ path: 'calender-venue-no-auth', version: '1' })
export class CalenderMgtVenueNoAutController {
    constructor(private readonly calenderMgtService: CalenderMgtService) { }

///==================


//================


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

    @ApiOperation({
        summary: 'DELETE - Soft delete venue by ID',
    })
    @Delete('venues/:venueId')
    async deleteVenue(@Param('venueId') venueId: string): Promise<void> {
        return this.calenderMgtService.deleteVenue(venueId);
    }
}

