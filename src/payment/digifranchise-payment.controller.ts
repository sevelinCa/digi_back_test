import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { OrderService } from './order.service';
import { Request } from 'express';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { CreateOrderTableDto, UpdateOrderTableDto } from './dto/order.dto';
import { OrderTable } from './entities/order.entity';
import { CreateRateDto, UpdateRateDto } from './dto/rate.dto';
import { RateTable } from './entities/rate.entity';
import { RateService } from './rate.service';

@ApiTags('rate')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'rate', version: '1' })
export class RateController {
    constructor(private readonly rateService: RateService) { }

    @ApiOperation({ summary: 'Create a new rate table' })
    @ApiResponse({ status: 201, description: 'Rate table has been successfully created.' })
    @ApiBody({ type: CreateRateDto })
    @Post('create-rate')
    async createRateTable(@Body() createRateDto: CreateRateDto): Promise<RateTable> {
        return this.rateService.createRateTable(createRateDto);
    }

    @ApiOperation({ summary: 'Get all rate tables' })
    @ApiResponse({ status: 200, description: 'Rate tables have been successfully retrieved.' })
    @Get('get-all-rates')
    async getAllRateTables(): Promise<RateTable[]> {
        return this.rateService.getAllRateTables();
    }

    @ApiOperation({ summary: 'Get a single rate table by ID' })
    @ApiResponse({ status: 200, description: 'Rate table has been successfully retrieved.' })
    @Get('get-one-rate/:rateId')
    async getOneRateTable(@Param('rateId') rateId: string): Promise<RateTable> {
        return this.rateService.getOneRateTable(rateId);
    }

    @ApiOperation({ summary: 'Update a rate table by ID' })
    @ApiResponse({ status: 200, description: 'Rate table has been successfully updated.' })
    @ApiBody({ type: UpdateRateDto })
    @Put('update-rate/:rateId')
    async updateRateTable(
        @Param('rateId') rateId: string,
        @Body() updateRateDto: UpdateRateDto,
    ): Promise<RateTable> {
        return this.rateService.updateRateTable(rateId, updateRateDto);
    }

    @ApiOperation({ summary: 'Delete a rate table by ID' })
    @ApiResponse({ status: 204, description: 'Rate table has been successfully deleted.' })
    @Delete('delete-rate/:rateId')
    async deleteRateTable(@Param('rateId') rateId: string): Promise<void> {
        return this.rateService.deleteRateTable(rateId);
    }
}

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'order', version: '1' })
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Order has been successfully created.' })
    @ApiBody({ type: CreateOrderTableDto })
    @Post('create-order/:productOrServiceId')
    async createOrder(
        @Req() req: Request,
        @Param('productOrServiceId') productOrServiceId: string,
        @Body() createOrderTableDto: CreateOrderTableDto,
    ): Promise<OrderTable> {
        const userId = (req.user as UserEntity).id;
        return this.orderService.createOrder(createOrderTableDto, userId, productOrServiceId);
    }

}


