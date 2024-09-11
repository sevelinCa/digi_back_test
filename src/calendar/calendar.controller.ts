import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CalendarService } from "./calendar.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SetWorkingHoursDto, TimeSlotDTO } from "./dto/availability.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/roles.guard";
import { BookedTimeslotDto } from "./dto/booked-timeslot.dto";

@ApiTags("Digifranchise Working Hours")
@Controller("calendar")
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({ summary: "Set Working Hours" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Digifranchise Owner is able to set Working Hours.",
  })
  @ApiBody({ type: SetWorkingHoursDto })
  @Post("set-working-hours/:ownedFranchiseId")
  async setWorkingHours(
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() workingHoursDto: SetWorkingHoursDto,
  ): Promise<any> {
    try {
      await this.calendarService.createWorkingHoursForDigifranchise(
        workingHoursDto,
        ownedFranchiseId,
      );
      return {
        message: "Availability created successfully",
        availabilities: workingHoursDto,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          message: "Error creating availability",
          error: error?.response?.error,
        },
        HttpStatus.CONFLICT,
      );
    }
  }
  @ApiOperation({ summary: "Get timeslots" })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      "Users can retrieve availabile slots by date and digifranchise",
  })
  @Get("get-timeslots/:ownedFranchiseId")
  async getTimeSlots(
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Query("date") workingDate: string,
  ): Promise<any> {
    try {
      const timeSlots = await this.calendarService.getTimeSlots(
        ownedFranchiseId,
        workingDate,
      );
      return { message: "Timeslots fetched successfully", timeSlots };
    } catch (error) {
      return { message: "Error fetching availability", error: error?.response };
    }
  }
  @ApiOperation({ summary: "Get Working Hours" })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      "Digifranchise Owner is able to to retrieve their working hours",
  })
  @Get("get-working-hours/:ownedFranchiseId")
  async getWorkingHours(
    @Param("ownedFranchiseId") ownedFranchiseId: string,
  ): Promise<any> {
    try {
      const availabilities =
        await this.calendarService.getWorkingHours(ownedFranchiseId);
      return { message: "Availability fetched successfully", availabilities };
    } catch (error) {
      return { message: "Error fetching availability", error: error?.response };
    }
  }
  @ApiOperation({ summary: "Update Working Hours" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Digifranchise Owner is able to update Working Hours.",
  })
  @ApiBody({ type: SetWorkingHoursDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Patch("update-working-hours/:ownedFranchiseId")
  async updateWorkingHours(
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() workingHoursDto: SetWorkingHoursDto,
  ): Promise<any> {
    try {
      const updatedSlots =
        await this.calendarService.updateWorkingHoursForDigifranchise(
          workingHoursDto,
          ownedFranchiseId,
        );
      return { message: "Availability updated successfully", updatedSlots };
    } catch (error) {
      return { message: "Error updating availability", error };
    }
  }
  @ApiOperation({ summary: "Book Timeslots" })
  @ApiBody({ type: [TimeSlotDTO] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Users can book timeslots",
  })
  @Put("book-timeslot/:ownedFranchiseId")
  async bookTimeSlot(
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() timeslots: BookedTimeslotDto[],
  ): Promise<any> {
    try {
      await this.calendarService.bookAvailabilitySlot(
        timeslots,
        ownedFranchiseId,
      );
      return { message: "Availability Booked successfully" };
    } catch (error) {
      return { message: "Error creating availability", error: error };
    }
  }
  @ApiOperation({ summary: "New Book Timeslots" })
  @ApiBody({ type: [TimeSlotDTO] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Users can book timeslots",
  })
  @Post("new-book-timeslot/:ownedFranchiseId")
  async newBookTimeSlot(
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() timeslots: BookedTimeslotDto[],
  ): Promise<any> {
    try {
      await this.calendarService.newBookAvailabilitySlot(
        timeslots,
        ownedFranchiseId,
      );
      return { message: "Availability Booked successfully" };
    } catch (error) {
      return { message: "Error creating availability", error: error };
    }
  }
}
