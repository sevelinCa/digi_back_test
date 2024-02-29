import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import type { CreateVenueDto } from './dto/create-venues.dto';
import type { CalenderMgtService } from './calender-mgt.service';
import type { CalenderVenue } from './entities/calender-venues.entity';

@ApiTags('Calender')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'calender', version: '1' })
export class CalenderMgtController {
    constructor(private readonly calenderMgtService: CalenderMgtService) {}

    @ApiOperation({
        summary: 'CREATE - Record Asset for User',
    })
    @Post('create-venue')
    async createVenue(@Body() createVenueDto: CreateVenueDto): Promise<CalenderVenue> {
       return this.calenderMgtService.createVenue(createVenueDto);
    }
}
