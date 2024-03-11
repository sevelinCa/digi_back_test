import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAvailabilityManagementDto, UpdateAvailabilityManagementDto } from './dto/create-availability-management.dto';
import { AvailableManagement } from './entities/available-management.entity';
import { Request } from 'express';
import { AvailabilityManagementService } from './availability-management.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { CreateUnavailableManagementDto, UpdateUnavailableManagementDto } from './dto/create-unavailable-Management.dto';
import { UnavailableManagement } from './entities/unavailable-management.entity';
import { UnavailableManagementService } from './unavailability-management.service';
import { CustomerManagementService } from './customer-management.service';
import { CreateCustomerManagementDto, UpdateCustomerManagementDto } from './dto/create-customer-management.dto';
import { CustomerManagement } from './entities/customer-management.entity';
import { CreateSupplierManagementDto, UpdateSupplierManagementDto } from './dto/create-supplier-management.dto';
import { SupplierManagement } from './entities/supplier-management.entity';
import { SupplierManagementService } from './supplier-management.service';

@ApiTags('Availability Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'availability-mgt', version: '1' })
export class AvailabilityManagementController {
    constructor(private readonly availabilityManagementService: AvailabilityManagementService) { }

    @ApiOperation({ summary: 'CREATE - Create - Availability', })
    @ApiResponse({ status: HttpStatus.OK, description: 'You have created Availability.' })
    @ApiBody({ type: CreateAvailabilityManagementDto })
    @Post('create-availability/:digifranchiseId')
    async createAvailability(
        @Req() req: Request,
        @Param('digifranchiseId') digifranchiseId: string,
        @Body() createAvailabilityManagementDto: CreateAvailabilityManagementDto): Promise<AvailableManagement> {
        const userId = (req.user as UserEntity).id;
        return this.availabilityManagementService.createAvailability(userId, digifranchiseId, createAvailabilityManagementDto);
    }

    @ApiOperation({ summary: 'GET - Get All Availabilities', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved all availabilities.' })
    @Get('get-all-availabilities')
    async getAllAvailability(): Promise<AvailableManagement[]> {
        return this.availabilityManagementService.getAllAvailability();
    }

    @ApiOperation({ summary: 'GET - Get Availability by ID', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved availability by ID.' })
    @Get('get-one-availability/:availabilityId')
    async getOneAvailabiltyById(@Param('availabilityId') availabilityId: string): Promise<AvailableManagement | null> {
        return this.availabilityManagementService.getOneAvailabiltyById(availabilityId);
    }

    @ApiOperation({ summary: 'UPDATE - Update Availability', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Updated availability.' })
    @ApiBody({ type: UpdateAvailabilityManagementDto })
    @Put('update-availability/:availabilityId')
    async updateAvailability(
        @Param('availabilityId') availabilityId: string,
        @Body() updateAvailabilityManagementDto: UpdateAvailabilityManagementDto): Promise<AvailableManagement> {
        return this.availabilityManagementService.updateAvailability(availabilityId, updateAvailabilityManagementDto);
    }

    @ApiOperation({ summary: 'DELETE - Delete Availability', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Deleted availability.' })
    @Delete('delete-availability/:availabilityId')
    async deleteVenue(@Param('availabilityId') availabilityId: string): Promise<void> {
        return this.availabilityManagementService.deleteAvailability(availabilityId);
    }
}


@ApiTags('Unavailable Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'unavailable-mgt', version: '1' })
export class UnavailableManagementController {
    constructor(private readonly unavailableManagementService: UnavailableManagementService) { }

    @ApiOperation({ summary: 'CREATE - Create Unavailable Management', })
    @ApiResponse({ status: HttpStatus.OK, description: 'You have created Unavailable Management.' })
    @ApiBody({ type: CreateUnavailableManagementDto })
    @Post('create-unavailable-management/:digifranchiseId')
    async createUnavailableManagement(
        @Req() req: Request,
        @Param('digifranchiseId') digifranchiseId: string,
        @Body() createUnavailableManagementDto: CreateUnavailableManagementDto): Promise<UnavailableManagement> {
        const userId = (req.user as UserEntity).id;
        return this.unavailableManagementService.createUnavailableManagement(userId, digifranchiseId, createUnavailableManagementDto);
    }

    @ApiOperation({ summary: 'GET - Get All Unavailable Management', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved all unavailable management.' })
    @Get('get-all-unavailable-managements')
    async getAllUnavailableManagement(): Promise<UnavailableManagement[]> {
        return this.unavailableManagementService.getAllUnavailableManagement();
    }

    @ApiOperation({ summary: 'GET - Get Unavailable Management by ID', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved unavailable management by ID.' })
    @Get('get-one-unavailable-management/:unavailableId')
    async getOneUnavailableManagementById(@Param('unavailableId') unavailableId: string): Promise<UnavailableManagement | null> {
        return this.unavailableManagementService.getOneUnavailableManagementById(unavailableId);
    }

    @ApiOperation({ summary: 'UPDATE - Update Unavailable Management', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Updated unavailable management.' })
    @ApiBody({ type: UpdateUnavailableManagementDto })
    @Put('update-unavailable-management/:unavailableId')
    async updateUnavailableManagement(
        @Param('unavailableId') unavailableId: string,
        @Body() updateUnavailableManagementDto: UpdateUnavailableManagementDto): Promise<UnavailableManagement> {
        return this.unavailableManagementService.updateUnavailableManagement(unavailableId, updateUnavailableManagementDto);
    }

    @ApiOperation({ summary: 'DELETE - Delete Unavailable Management', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Deleted unavailable management.' })
    @Delete('delete-unavailable-management/:unavailableId')
    async deleteUnavailableManagement(@Param('unavailableId') unavailableId: string): Promise<void> {
        return this.unavailableManagementService.deleteUnavailableManagement(unavailableId);
    }
}

@ApiTags('Customer Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('customer-management')
export class CustomerManagementController {
    constructor(private readonly customerManagementService: CustomerManagementService) { }

    @ApiOperation({ summary: 'Create a new customer availability' })
    @ApiResponse({ status: 201, description: 'The customer availability has been successfully created.' })
    @ApiBody({ type: CreateCustomerManagementDto })
    @Post('create-customer/:digifranchiseId')
    async createCustomer(
        @Req() req: Request,
        @Param('digifranchiseId') digifranchiseId: string,
        @Body() createCustomerManagementDto: CreateCustomerManagementDto): Promise<CustomerManagement> {
        const userId = (req.user as UserEntity).id;
        return this.customerManagementService.createCustomer(userId, digifranchiseId, createCustomerManagementDto);
    }


    @ApiOperation({ summary: 'Retrieve all customer availabilities' })
    @ApiResponse({ status: 200, description: 'The list of customer availabilities has been successfully retrieved.' })
    @Get('get-all-customers')
    async getAllCustomer(): Promise<CustomerManagement[]> {
        return this.customerManagementService.getAllCustomer();
    }

    @ApiOperation({ summary: 'Retrieve a customer availability by ID' })
    @ApiResponse({ status: 200, description: 'The customer availability has been successfully retrieved.' })
    @Get('get-one-customer/:customerId')
    async getOneCustomerById(@Param('customerId') customerId: string): Promise<CustomerManagement | null> {
        return this.customerManagementService.getOneCustomerById(customerId);
    }

    @ApiOperation({ summary: 'Update a customer availability by ID' })
    @ApiResponse({ status: 200, description: 'The customer availability has been successfully updated.' })
    @ApiBody({ type: UpdateCustomerManagementDto })
    @Put('update-customer/:customerId')
    async updateCustomer(
        @Param('customerId') customerId: string,
        @Body() updateCustomerManagementDto: UpdateCustomerManagementDto,
    ): Promise<CustomerManagement> {
        return this.customerManagementService.updateCustomer(customerId, updateCustomerManagementDto);
    }

    @ApiOperation({ summary: 'Delete a customer availability by ID' })
    @ApiResponse({ status: 204, description: 'The customer availability has been successfully deleted.' })
    @Delete('delete-customer/:customerId')
    async deleteCustomer(@Param('customerId') customerId: string): Promise<void> {
        return this.customerManagementService.deleteCustomer(customerId);
    }
}


@ApiTags('Supplier Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('supplier-management')
export class SupplierManagementController {
    constructor(private readonly supplierManagementService: SupplierManagementService) { }

    @ApiOperation({ summary: 'Create a new supplier availability' })
    @ApiResponse({ status: 201, description: 'The supplier availability has been successfully created.' })
    @ApiBody({ type: CreateSupplierManagementDto })
    @Post('create-supplier/:digifranchiseId')
    async createSupplier(
        @Req() req: Request,
        @Param('digifranchiseId') digifranchiseId: string,
        @Body() createSupplierManagementDto: CreateSupplierManagementDto): Promise<SupplierManagement> {
        const userId = (req.user as UserEntity).id;
        return this.supplierManagementService.createSupplier(userId, digifranchiseId, createSupplierManagementDto);
    }


}