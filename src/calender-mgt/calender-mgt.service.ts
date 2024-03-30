import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVenueDto, type UpdateVenueDto } from './dto/create-venues.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';
import { CalenderVenue } from './entities/calender-venues.entity';
import { CalenderEvents } from './entities/calender-events.entity';
import { CreateEventDto, type UpdateEventDto } from './dto/create-events.dto';
import { checkIfUserExists } from '../helper/FindByFunctions'
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { CalenderEventOwner } from './entities/calender-event-owner.entity';
import { CalenderBooking } from './entities/calender-bookings.entity';
import type { CreateBookingDto, UpdateBookingDto } from './dto/create-bookings.dto';
import { CalenderEventGuest } from './entities/calender-event-guest.entity';
import { CustomerManagement } from 'src/digifranchise-mgt/entities/customer-management.entity';
import type { MailerService } from 'src/mailer/mailer.service';
@Injectable()
export class CalenderMgtService {
    constructor(
        @InjectRepository(CalenderVenue)
        private readonly venueRepository: Repository<CalenderVenue>,
        @InjectRepository(CalenderEvents)
        private readonly eventsRepository: Repository<CalenderEvents>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(CalenderEventOwner)
        private readonly eventOwnerRepository: Repository<CalenderEventOwner>,
        @InjectRepository(CalenderEventGuest)
        private readonly calenderEventGuestRepository: Repository<CalenderEventGuest>,
        @InjectRepository(CustomerManagement)
        private readonly customerManagementRepository: Repository<CustomerManagement>,
        @InjectRepository(CalenderBooking)
        private readonly bookingRepository: Repository<CalenderBooking>,
        // private readonly mailerService: MailerService,

    ) { }


    async createVenue(createVenueDto: CreateVenueDto): Promise<CalenderVenue> {
        const newVenue = this.venueRepository.create(createVenueDto);
        return this.venueRepository.save(newVenue);
    }

    async createEvent(userId: string, venueId: string, createEventDto: CreateEventDto): Promise<CalenderEvents> {
        const user = await checkIfUserExists(this.userRepository, userId)
        if (!user) {
            throw new Error('User does not exist')
        }
        const venue = await this.venueRepository.findOne({ where: { id: venueId } });
        if (!venue) {
            throw new Error('Venue does not exist');
        }
        const newEvent = this.eventsRepository.create({ ...createEventDto, userId: user, venueId: venue })
        const savedEvent = await this.eventsRepository.save(newEvent);

        const newEventOwner = this.eventOwnerRepository.create({
            eventId: savedEvent,
            userId: user
        })
        await this.eventOwnerRepository.save(newEventOwner)

        if (createEventDto.guestIds) {
            for (const guestId of createEventDto.guestIds) {
                const customer = await this.customerManagementRepository.findOne({ where: { id: guestId } });
                if (!customer) {
                    throw new Error(`Customer with ID ${guestId} not found.`);
                }

                const guest = this.calenderEventGuestRepository.create({
                    customerId: customer,
                    eventId: savedEvent,
                });
                await this.calenderEventGuestRepository.save(guest);
            }
        }

        return savedEvent;
    }

    async GetAllEventWithTheirGuest(): Promise<CalenderEvents[]> {
        return this.eventsRepository.find({
            relations: ['guests', 'guests.customerId', 'venueId'],
        });
    }
    
    async GetOneEventWithItsGuest(eventId: string): Promise<CalenderEvents | null> {
        return this.eventsRepository.findOne({
            where: { id: eventId },
            relations: ['guests', 'guests.customerId', 'venueId'], 
        });
    }

    async recordBooking(userId: string, eventId: string, createBookingDto: CreateBookingDto): Promise<CalenderBooking> {

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User does not exist');
        }
        const event = await this.eventsRepository.findOne({ where: { id: eventId } })
        if (!event) {
            throw new Error('Event does not exist');
        }
        const newBooking = this.bookingRepository.create({
            ...createBookingDto,
            userId: user,
            eventId: event,
        })

        const saveNewBooking = this.bookingRepository.save(newBooking)
        return saveNewBooking;
    }
    async getAllVenues(): Promise<CalenderVenue[]> {
        return this.venueRepository.find({ where: { deleteAt: IsNull() } });
    }

    async getAllEvents(): Promise<CalenderEvents[]> {
        return this.eventsRepository.find({ where: { deleteAt: IsNull() } });
    }

    async getAllBookings(): Promise<CalenderBooking[]> {
        return this.bookingRepository.find({ where: { deleteAt: IsNull() } });
    }

    async getAllEventOwners(): Promise<CalenderEventOwner[]> {
        return this.eventOwnerRepository.find({ where: { deleteAt: IsNull() } });
    }

    async getVenueById(venueId: string): Promise<CalenderVenue | null> {
        return this.venueRepository.findOne({ where: { id: venueId, deleteAt: IsNull() } });
    }

    async updateVenue(venueId: string, updateVenueDto: UpdateVenueDto): Promise<CalenderVenue> {
        const venue = await this.venueRepository.findOne({ where: { id: venueId, deleteAt: IsNull() } });
        if (!venue) {
            throw new NotFoundException(`Venue with ID ${venueId} not found or has been soft deleted.`);
        }
        this.venueRepository.merge(venue, updateVenueDto);
        return this.venueRepository.save(venue);
    }

    async getEventById(eventId: string): Promise<CalenderEvents | null> {
        return this.eventsRepository.findOne({ where: { id: eventId, deleteAt: IsNull() } });
    }

    async getBookingById(bookingId: string): Promise<CalenderBooking | null> {
        return this.bookingRepository.findOne({ where: { id: bookingId, deleteAt: IsNull() } });
    }


    async getEventOwnerById(eventOwnerId: string): Promise<CalenderEventOwner | null> {
        return this.eventOwnerRepository.findOne({ where: { id: eventOwnerId, deleteAt: IsNull() } });
    }

    async updateEvent(eventId: string, updateEventDto: UpdateEventDto): Promise<CalenderEvents> {
        const event = await this.eventsRepository.findOne({ where: { id: eventId, deleteAt: IsNull() } });
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found or has been soft deleted.`);
        }
        this.eventsRepository.merge(event, updateEventDto);
        return this.eventsRepository.save(event);
    }

    async updateBooking(bookingId: string, updateBookingDto: UpdateBookingDto): Promise<CalenderBooking> {
        const booking = await this.bookingRepository.findOne({ where: { id: bookingId, deleteAt: IsNull() } });
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found or has been soft deleted.`);
        }
        this.bookingRepository.merge(booking, updateBookingDto);
        return this.bookingRepository.save(booking);
    }

    async deleteVenue(venueId: string): Promise<void> {
        const venue = await this.venueRepository.findOne({ where: { id: venueId } });
        if (!venue) {
            throw new NotFoundException(`Venue with ID ${venueId} not found.`);
        }
        venue.deleteAt = new Date();
        await this.venueRepository.save(venue);
    }

    async deleteEvent(eventId: string): Promise<void> {
        const event = await this.eventsRepository.findOne({ where: { id: eventId } });
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found.`);
        }
        event.deleteAt = new Date();
        await this.eventsRepository.save(event);
    }


    async deleteBooking(bookingId: string): Promise<void> {
        const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found.`);
        }
        booking.deleteAt = new Date();
        await this.bookingRepository.save(booking);
    }

    async deleteEventOwner(eventOwnerId: string): Promise<void> {
        const eventOwner = await this.eventOwnerRepository.findOne({ where: { id: eventOwnerId } });
        if (!eventOwner) {
            throw new NotFoundException(`Event owner with ID ${eventOwnerId} not found.`);
        }
        eventOwner.deleteAt = new Date();
        await this.eventOwnerRepository.save(eventOwner);
    }

    async getAllEventsByUserId(userId: string): Promise<CalenderEvents[]> {
        return this.eventsRepository.find({ where: { userId: Equal(userId), deleteAt: IsNull() } });
    }

    async getAllEventsByVenueId(venueId: string): Promise<CalenderEvents[]> {
        return this.eventsRepository.find({ where: { venueId: Equal(venueId), deleteAt: IsNull() } });
    }

    async getAllBookingsByUserId(userId: string): Promise<CalenderBooking[]> {
        return this.bookingRepository.find({ where: { userId: Equal(userId), deleteAt: IsNull() } });
    }

    async getAllBookingsByEventId(eventId: string): Promise<CalenderBooking[]> {
        return this.bookingRepository.find({ where: { eventId: Equal(eventId), deleteAt: IsNull() } });
    }

    async addCustomerToEvent(customerId: string, eventId: string): Promise<CalenderEventGuest> {
        const customer = await this.calenderEventGuestRepository.findOne({ where: { id: customerId } });
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${customerId} not found.`);
        }

        const event = await this.eventsRepository.findOne({ where: { id: eventId } });
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found.`);
        }

        const newCalenderEventGuest = this.calenderEventGuestRepository.create({
            customerId: customer,
            eventId: event,
        });

        return this.calenderEventGuestRepository.save(newCalenderEventGuest);
    }

    async findAllCustomersForEvent(): Promise<CalenderEventGuest[]> {
        return this.calenderEventGuestRepository.find({ where: { deleteAt: IsNull() } });
    }

    async findOneCustomerForEvenet(id: string): Promise<CalenderEventGuest | null> {
        return this.calenderEventGuestRepository.findOne({ where: { id } });
    }

    async removeCustomerFromEvent(id: string): Promise<void> {
        const calenderEventGuest = await this.calenderEventGuestRepository.findOne({ where: { id } });
        if (!calenderEventGuest) {
            throw new NotFoundException(`CalenderEventCustomer with ID ${id} not found.`);
        }

        await this.calenderEventGuestRepository.remove(calenderEventGuest);
    }

    async removeGuestFromEvent(guestId: string, eventId: string): Promise<void> {
        const guestEventAssociation = await this.calenderEventGuestRepository.findOne({
            where: { id: guestId, eventId: { id: eventId } },
        });
    
        if (!guestEventAssociation) {
            throw new NotFoundException(`Guest with ID ${guestId} not found in the specified event.`);
        }
    
        // Assuming you want to remove the association entirely
        await this.calenderEventGuestRepository.remove(guestEventAssociation);
    }
}