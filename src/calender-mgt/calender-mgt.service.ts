import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVenueDto, type UpdateVenueDto } from './dto/create-venues.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CalenderVenue } from './entities/calender-venues.entity';
import { CalenderEvents } from './entities/calender-events.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { checkIfUserExists } from '../helper/FindByFunctions'
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { CalenderEventOwner } from './entities/calender-event-owner.entity';
import { CalenderBooking } from './entities/calender-bookings.entity';
import type { CreateBookingDto } from './dto/create-bookings.dto';
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
        
        @InjectRepository(CalenderBooking)
        private readonly bookingRepository: Repository<CalenderBooking>
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
        const venue = await this.venueRepository.findOne({where:{id:venueId}});
        if (!venue) {
            throw new Error('Venue does not exist');
        }
        const newEvent = this.eventsRepository.create({ ...createEventDto, userId: user, venueId:venue })
        const savedEvent = await this.eventsRepository.save(newEvent);

        const newEventOwer = this.eventOwnerRepository.create({
            eventId:savedEvent,
            userId:user
        })
        await this.eventOwnerRepository.save(newEventOwer)

        return savedEvent;
    }

    async recordBooking(userId:string, eventId:string,createBookingDto: CreateBookingDto): Promise<CalenderBooking>{

        const user = await this.userRepository.findOne({where:{id:userId}});
        if(!user){
            throw new Error ('User does not exist');
        }
        const event = await this.eventsRepository.findOne({ where: {id: eventId}})
        if(!event){
            throw new Error ('Event does not exist');
        }
        const newBooking = this.bookingRepository.create({
            ...createBookingDto,
            userId:user,
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


}