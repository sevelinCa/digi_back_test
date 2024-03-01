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


}