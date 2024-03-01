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
}