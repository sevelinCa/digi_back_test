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

@ApiTags('Tax Rate')
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
    @Post('create-order/:productOrServiceOrCategoryId')
    async createOrder(
        @Req() req: Request,
        @Param('productOrServiceOrCategoryId') productOrServiceOrCategoryId: string,
        @Body() createOrderTableDto: CreateOrderTableDto,
    ): Promise<OrderTable> {
        const userId = (req.user as UserEntity).id;
        return this.orderService.createOrder(createOrderTableDto, userId, productOrServiceOrCategoryId);
    }

    @ApiOperation({ summary: 'Get all orders for a user' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Orders have been successfully retrieved.' })
    @Get('get-all-order')
    async getAllOrders(@Req() req: Request): Promise<OrderTable[]> {
        const userId = (req.user as UserEntity).id;
        return this.orderService.getAllOrders(userId);
    }

    @ApiOperation({ summary: 'Get a single order by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Order has been successfully retrieved.' })
    @Get('get-one-order/:orderId')
    async getOneOrder(@Param('orderId') orderId: string): Promise<OrderTable | null> {
        return this.orderService.getOneOrder(orderId);
    }

    @ApiOperation({ summary: 'Update an order by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Order has been successfully updated.' })
    @ApiBody({ type: UpdateOrderTableDto })
    @Put('update-order/:orderId')
    async updateOrder(
        @Param('orderId') orderId: string,
        @Body() updateOrderTableDto: UpdateOrderTableDto,
    ): Promise<OrderTable> {
        return this.orderService.updateOrder(orderId, updateOrderTableDto);
    }

    @ApiOperation({ summary: 'Delete an order by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Order has been successfully deleted.' })
    @Delete('delete-order/:orderId')
    async deleteOrder(@Param('orderId') orderId: string): Promise<void> {
        return this.orderService.deleteOrder(orderId);
    }
}


