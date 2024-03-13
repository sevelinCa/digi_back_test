import { UseGuards, Controller, HttpStatus, Post, Req, Param, Get, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { RolesGuard } from "src/roles/roles.guard";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { CustomerSubscriptionService } from "./customer-subscription.service";
import { CustomerSubscription } from "./entities/customer-subscription.entity";
import { Request } from "express";


@ApiTags('Customer Subscription')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'subscription', version: '1' })
export class CustomerSubscriptionController {
    constructor(private readonly subscriptionService: CustomerSubscriptionService) { }

    @ApiOperation({ summary: 'CREATE - Create a new subscription' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'A new subscription has been successfully created.' })
    @Post('create-subscription/:digifranchiseId')
    async createSubscription(
        @Req() req: Request,
        @Param('digifranchiseId') digifranchiseId: string,
    ): Promise<CustomerSubscription> {
        const userId = (req.user as UserEntity).id;
        return this.subscriptionService.createSubscription(userId, digifranchiseId);
    }

    @ApiOperation({ summary: 'GET ALL - Retrieve all subscriptions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All subscriptions have been successfully retrieved.' })
    @Get('get-all-subscriptions')
    async getAllSubscriptions(@Req() req: Request): Promise<CustomerSubscription[]> {
        const userId = (req.user as UserEntity).id;
        return this.subscriptionService.getAllSubscriptions(userId);
    }

    @ApiOperation({ summary: 'GET ONE - Retrieve a subscription by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Subscription has been successfully retrieved.' })
    @Get('get-one-subscription/:subscriptionId')
    async getOneSubscription(@Param('subscriptionId') subscriptionId: string): Promise<CustomerSubscription | null> {
        return this.subscriptionService.getOneSubscription(subscriptionId);
    }

    @ApiOperation({ summary: 'DELETE - Delete a subscription by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Subscription has been successfully deleted.' })
    @Delete('delete-subscription/:subscriptionId')
    async deleteSubscription(@Param('subscriptionId') subscriptionId: string): Promise<void> {
        return this.subscriptionService.deleteSubscription(subscriptionId);
    }

    @ApiOperation({ summary: 'GET - Retrieve subscribers by Digifranchise ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Subscribers have been successfully retrieved.' })
    @Get('get-subscribers/:digifranchiseId')
    async getSubscribersByDigifranchiseId(@Param('digifranchiseId') digifranchiseId: string): Promise<CustomerSubscription[]> {
        return this.subscriptionService.getSubscribersByDigifranchiseId(digifranchiseId);
    }
}