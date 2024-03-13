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

}