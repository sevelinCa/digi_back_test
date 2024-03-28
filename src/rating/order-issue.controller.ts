import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderIssueDto } from './dto/Complaints.dto';
import { OrderIssueTable } from './entities/Complaints.entity';
import { OrderIssueService } from './order-issue.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Order - Issue')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'order-issue', version: '1' })
export class OrderIssueController {

    constructor(private readonly OrderIssueService: OrderIssueService) { }

    @ApiOperation({ summary: 'CREATE - Create a new issue' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'A new issue has been successfully created.' })
    @ApiBody({ type: CreateOrderIssueDto })
    @Post('create/:orderId')
    async createOrderIssue(
        @Param('orderId') orderId: string,
        @Body() createOrderIssueDto: CreateOrderIssueDto,
    ): Promise<OrderIssueTable> {
        return this.OrderIssueService.createOrderIssue(createOrderIssueDto, orderId);
    }

}
