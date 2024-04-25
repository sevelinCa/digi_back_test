import { Controller, Post, Body, Param, HttpStatus, HttpException, Get, Delete, NotFoundException, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto } from './dto/availability.dto';
import { AvailabilitySlotsDetails, type AvailabilityDayTime, type Unavailability } from './entities/availability.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@ApiTags('NEW AVAILABILITY')
@Controller({ path: 'availability', version: '1' })
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) { }


    @ApiOperation({ summary: 'Create New Availability' })
    @ApiResponse({ status: HttpStatus.OK, description: 'New availability created.' })
    @ApiBody({ type: AvailabilityDto })
    @Post('new-availability/:ownedFranchiseId')
    async createAvailability(
        @Param('ownedFranchiseId') ownedFranchiseId: string,

        @Body() availabilityDto: AvailabilityDto
    ): Promise<any> {
        return await this.availabilityService.createAvailability(availabilityDto, ownedFranchiseId);
    }

    @ApiOperation({ summary: 'Get availability by date and franchise' })
    @ApiResponse({ status: 200, description: 'Availabilities retrieved successfully.', type: [AvailabilitySlotsDetails] })
    @Get('availability-slot-by-date-and-franchise/:ownerFranchiseId')
    async getAvailabilitySlotsByDateAndFranchise(
        @Query('date') date: string,
        @Param('ownerFranchiseId') ownerFranchiseId: string
    ): Promise<AvailabilitySlotsDetails[]> {
        const parsedDate = new Date(date);
        return await this.availabilityService.getAvailabilitySlotsByDateAndFranchise(parsedDate, ownerFranchiseId);
    }



    @ApiOperation({ summary: 'Book a slot detail' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Slot booked successfully.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Slot not found or does not belong to the specified franchise.' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Slot is already booked.' })
    @Post('book-slot-detail/:slotId/:ownedFranchiseId')
    async bookSlotDetail(
        @Param('slotId') slotId: string,
        @Param('ownedFranchiseId') ownedFranchiseId: string
    ): Promise<AvailabilitySlotsDetails> {
        try {
            const updatedSlot = await this.availabilityService.bookSlotDetail(slotId, ownedFranchiseId);
            return updatedSlot;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @ApiOperation({ summary: 'Get all availability slots by franchise' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All availability slots retrieved successfully.', type: [AvailabilitySlotsDetails] })
    @Get('all-slots-by-franchise/:ownerFranchiseId')
    async getAllAvailabilitySlotsByAndFranchise(
        @Param('ownerFranchiseId') ownerFranchiseId: string
    ): Promise<AvailabilitySlotsDetails[]> {
        try {
            const slots = await this.availabilityService.getAllAvailabilitySlotsByAndFranchise(ownerFranchiseId);
            return slots;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @ApiOperation({ summary: 'Update Availability' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Availability updated.' })
    @ApiBody({ type: UpdateAvailabilityDto })
    @Put('update-availability/:availabilityId')
    async updateAvailability(
        @Param('availabilityId') availabilityId: string,
        @Body() updateAvailabilityDto: UpdateAvailabilityDto
    ): Promise<any> {
        return await this.availabilityService.updateAvailability(updateAvailabilityDto, availabilityId);
    }

    @ApiOperation({ summary: 'Get all slots in date by date and franchise' })
    @ApiResponse({ status: 200, description: 'Slots retrieved successfully.', type: [Object] })
    @Get('all-slots-in-date/:ownerFranchiseId')
    async getAllSlotesInDateByDateAndFranchise(
        @Query('date') date: string,
        @Param('ownerFranchiseId') ownerFranchiseId: string
    ): Promise<{ startTime: string; endTime: string }[]> {
        try {
            const parsedDate = new Date(date);
            return await this.availabilityService.getAllSlotesInDateByDateAndFranchise(parsedDate, ownerFranchiseId);
        } catch (error) {
            throw new HttpException('Error fetching availability time slots details', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('working-hours-range/:ownerFranchiseId')
    async getWorkingHoursRange(@Param('ownerFranchiseId') ownerFranchiseId: string) {
        return this.availabilityService.getWorkingHoursRange(ownerFranchiseId);
    }

    @ApiOperation({ summary: 'Get all unavailabilities by franchise' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All unavailabilities retrieved successfully.', type: [AvailabilitySlotsDetails] })
    @Get('get-all-unavailabilities/:ownerFranchiseId')
    async getUnavailbilityByFranchise(
        @Param('ownerFranchiseId') ownerFranchiseId: string
    ): Promise<Unavailability[]> {
        try {
            const unavailbilities = await this.availabilityService.getUnavailbilityByFranchise(ownerFranchiseId);
            return unavailbilities;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}

