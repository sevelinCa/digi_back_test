import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { RatingOrderService } from './rating-order.service';
import { RatingOrderTable } from './entities/rating-order.entity';
import { Request } from 'express';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { CreateRatingOrderDto } from './dto/rating-order.dto';

@ApiTags('Rating - order')

@Controller({ path: 'rating-orders', version: '1' })
export class RatingOrderController {
    constructor(private readonly ratingOrderService: RatingOrderService) { }

    @ApiOperation({ summary: 'CREATE - Create a new rating order' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'A new rating order has been successfully created.' })
    @ApiBody({ type: CreateRatingOrderDto })
    @Post('rating-order')
    async createRatingOrder(
        @Req() req: Request,
        @Body() createRatingOrderDto: CreateRatingOrderDto,
        @Query('orderId') orderId: string): Promise<RatingOrderTable> {
        return this.ratingOrderService.createRatingOrder(orderId, createRatingOrderDto);
    }

    @ApiOperation({ summary: 'CREATE - Create a new rating order' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'A new rating order has been successfully created.' })
    @ApiBody({ type: CreateRatingOrderDto })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('rating-order-with-auth')
    async createRatingOrderWithAuth(
        @Req() req: Request,
        @Body() createRatingOrderDto: CreateRatingOrderDto,
        @Query('orderId') orderId: string): Promise<RatingOrderTable> {
        const userId = (req.user as UserEntity).id;
        return this.ratingOrderService.createRatingOrderWithAuth(userId, orderId, createRatingOrderDto);
    }

    @ApiOperation({ summary: 'GET - Retrieve all rating orders' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All rating orders retrieved successfully.' })
    @Get('get-all-ratings')
    async getAllRatingOrders(): Promise<RatingOrderTable[]> {
        return this.ratingOrderService.getAllRatingOrders();
    }

    @ApiOperation({ summary: 'GET - Retrieve a single rating order by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Rating order retrieved successfully.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Rating order not found.' })
    @Get(':ratingId')
    async getRatingOrderById(@Param('ratingId') ratingId: string): Promise<RatingOrderTable> {
        return this.ratingOrderService.getRatingOrderById(ratingId);
    }
}