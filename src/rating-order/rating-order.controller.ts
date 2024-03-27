import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { RatingOrderService } from './rating-order.service';
import { RatingOrderTable } from './entities/rating-order.entity';
import { Request } from 'express';
import type { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { CreateRatingOrderDto } from './dto/rating-order.dto';

@ApiTags('Rating - order')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
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
        const userId = (req.user as UserEntity).id;
        return this.ratingOrderService.createRatingOrder(userId, orderId, createRatingOrderDto); 
    }

}