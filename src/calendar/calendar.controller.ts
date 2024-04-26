import { Body, Controller, HttpStatus, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SetWorkingHoursDto } from './dto/availability.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Digifranchise Working Hours')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }

  @ApiOperation({ summary: 'Set Working Hours' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Digifranchise Owner is able to set Working Hours.' })
  @ApiBody({ type: SetWorkingHoursDto })
  @Post('set-working-hours/:ownedFranchiseId')
  async setWorkingHours(
    @Param('ownedFranchiseId') ownedFranchiseId: string,
    @Body() workingHoursDto: SetWorkingHoursDto
  ): Promise<any> {
    return await this.calendarService.createWorkingHoursForDigifranchise(workingHoursDto, ownedFranchiseId);
  }

  @ApiOperation({ summary: 'Update Working Hours' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Digifranchise Owner is able to update Working Hours.' })
  @ApiBody({ type: SetWorkingHoursDto })
  @Patch('update-working-hours/:ownedFranchiseId')
  async updateWorkingHours(
    @Param('ownedFranchiseId') ownedFranchiseId: string,
    @Body() workingHoursDto: SetWorkingHoursDto
  ): Promise<any> {
    return await this.calendarService.createWorkingHoursForDigifranchise(workingHoursDto, ownedFranchiseId);
  }
}
