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
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SetWorkingHoursDto } from './dto/availability.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Digifranchise Working Hours')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({ summary: 'Set Working Hours' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Digifranchise Owner is able to set Working Hours.',
  })
  @ApiBody({ type: SetWorkingHoursDto })
  @Post('set-working-hours/:ownedFranchiseId')
  async setWorkingHours(
    @Param('ownedFranchiseId') ownedFranchiseId: string,
    @Body() workingHoursDto: SetWorkingHoursDto
  ): Promise<any> {
    try {
      await this.calendarService.createWorkingHoursForDigifranchise(
        workingHoursDto,
        ownedFranchiseId
      );
      return {
        message: 'Availability created successfully',
        availabilities: workingHoursDto,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          message: 'Error creating availability',
          error: error?.response?.error,
        },
        HttpStatus.CONFLICT
      );
    }
  }
  @ApiOperation({ summary: 'Get Working Hours' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Digifranchise Owner is able to to retrieve their working hours',
  })
  // @ApiBody({ type: SetWorkingHoursDto })
  @Get('get-working-hours/:ownedFranchiseId')
  async getWorkingHours(
    @Param('ownedFranchiseId') ownedFranchiseId: string
  ): Promise<any> {
    try {
      const availabilities =
        await this.calendarService.getWorkingHours(ownedFranchiseId);
      return { message: 'Availability fetched successfully', availabilities };
    } catch (error) {
      console.log(error, '=======++++');
      // return { message: 'Error creating availability', error: error };
    }
  }
  @ApiOperation({ summary: 'Update Working Hours' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Digifranchise Owner is able to update Working Hours.',
  })
  @ApiBody({ type: SetWorkingHoursDto })
  @Patch('update-working-hours/:ownedFranchiseId')
  async updateWorkingHours(
    @Param('ownedFranchiseId') ownedFranchiseId: string,
    @Body() workingHoursDto: SetWorkingHoursDto
  ): Promise<any> {
    try {
      const availability =
        await this.calendarService.createWorkingHoursForDigifranchise(
          workingHoursDto,
          ownedFranchiseId
        );
      return { message: 'Availability updated successfully', availability };
    } catch (error) {
      console.log(error, '=======++++');
      // return { message: 'Error creating availability', error: error };
    }
  }
}
