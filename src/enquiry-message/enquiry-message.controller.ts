import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { EnquiryMessageService } from './enquiry-message.service';
import { EnquiriesTable } from './entities/enquiries.entity';
import { CreateEnquiriesTableDto } from './dto/enquiries.dto';


@ApiTags('Enquiry - message')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'enquiry', version: '1' })
export class EnquiryMessageController {
    constructor(private readonly enquiryMessageService: EnquiryMessageService) { }

    @ApiOperation({ summary: 'CREATE - Create a new enquiries' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'A new enquiries has been successfully created.' })
    @ApiBody({ type: CreateEnquiriesTableDto })
    @Post('create-enquiries/:digifranchiseOwnedId')
    async createEquiry(
        @Param('digifranchiseOwnedId') digifranchiseOwnedId: string,
        @Body() createEnquiriesTableDto: CreateEnquiriesTableDto,
    ): Promise<EnquiriesTable> {
        return this.enquiryMessageService.createEquiry(createEnquiriesTableDto, digifranchiseOwnedId);
    }

    @ApiOperation({ summary: 'GET - Retrieve all enquiries' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All enquiries retrieved successfully.' })
    @Get('enquiries')
    async getAllEnquiries(): Promise<EnquiriesTable[]> {
        return this.enquiryMessageService.getAllEnquiries();
    }



}

