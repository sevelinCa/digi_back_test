import { Controller, Post, Body, Param, HttpStatus, HttpException, Get, Delete, NotFoundException, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto } from './dto/availability.dto';
import  { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { Availability, AvailabilitySlotsDetails } from './entities/availability.entity';

@ApiTags('NEW AVAILABILITY')
@Controller({ path: 'availability', version: '1' })
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) { }


    @ApiOperation({ summary: 'Create New Availability' })
    @ApiResponse({ status: HttpStatus.OK, description: 'New availability created.' })
    @ApiBody({ type: AvailabilityDto })
    @Post('new-availability/:ownedFranchiseId')
    async createNewAvailability(
        @Param('ownedFranchiseId') ownedFranchiseId: string,

        @Body() availabilityDto: AvailabilityDto
    ): Promise<any> {
        return await this.availabilityService.createNewAvailability(availabilityDto, ownedFranchiseId);
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



    // @ApiOperation({ summary: 'Get Available Availability' })
    // @ApiResponse({ status: HttpStatus.OK, description: 'Available availability retrieved.' })
    // @Get('available-all-week-availability/:ownedFranchiseId')
    // async getAvailableAvailability(@Param('ownedFranchiseId') ownedFranchiseId: string): Promise<any> {
    //     const availableAvailability = await this.availabilityService.getAvailableAvailability(ownedFranchiseId);
    //     return availableAvailability;
    // }


    //----------------------


    // @Get(':availabilityId')
    // @ApiOperation({ summary: 'Get availability by ID' })
    // @ApiResponse({ status: 200, description: 'The availability has been successfully retrieved.', type: Availability })
    // @ApiResponse({ status: 404, description: 'Availability not found.' })
    // async getAvailabilityByOwnedFranchiseId(@Param('availabilityId') availabilityId: string): Promise<Availability | null> {
    //     const availability = await this.availabilityService.getAvailabilityByOwnedFranchiseId(availabilityId);
    //     if (!availability) {
    //         throw new NotFoundException('Availability not found');
    //     }
    //     return availability;
    // }

    // @Delete(':availabilityId')
    // @ApiOperation({ summary: 'Delete availability by ID' })
    // @ApiResponse({ status: 200, description: 'The availability has been successfully deleted.' })
    // @ApiResponse({ status: 404, description: 'Availability not found.' })
    // async deleteAvailabilityByOwnedFranchiseId(@Param('availabilityId') availabilityId: string): Promise<void> {
    //     await this.availabilityService.deleteAvailabilityByOwnedFranchiseId(availabilityId);
    // }

    // @Put(':availabilityId')
    // @ApiOperation({ summary: 'Update availability by ID' })
    // @ApiResponse({ status: 200, description: 'The availability has been successfully updated.', type: Availability })
    // @ApiResponse({ status: 404, description: 'Availability not found.' })
    // async updateAvailability(@Param('availabilityId') availabilityId: string, @Body() updateAvailabilityDto: UpdateAvailabilityDto): Promise<Availability> {
    //     const updatedAvailability = await this.availabilityService.updateAvailability(availabilityId, updateAvailabilityDto);
    //     if (!updatedAvailability) {
    //         throw new NotFoundException('Availability not found');
    //     }
    //     return updatedAvailability;
    // }
}

