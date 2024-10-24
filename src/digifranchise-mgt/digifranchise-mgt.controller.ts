import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import {
  CreateAvailabilityManagementDto,
  UpdateAvailabilityManagementDto,
} from "./dto/create-availability-management.dto";
import { AvailableManagement } from "./entities/available-management.entity";
import { Request } from "express";
import { AvailabilityManagementService } from "./availability-management.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/roles.guard";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import {
  CreateUnavailableManagementDto,
  UpdateUnavailableManagementDto,
} from "./dto/create-unavailable-Management.dto";
import { UnavailableManagement } from "./entities/unavailable-management.entity";
import { UnavailableManagementService } from "./unavailability-management.service";
import { CustomerManagementService } from "./customer-management.service";
import {
  CreateCustomerManagementDto,
  UpdateCustomerManagementDto,
} from "./dto/create-customer-management.dto";
import { CustomerManagement } from "./entities/customer-management.entity";
import {
  CreateSupplierManagementDto,
  UpdateSupplierManagementDto,
} from "./dto/create-supplier-management.dto";
import { SupplierManagement } from "./entities/supplier-management.entity";
import { SupplierManagementService } from "./supplier-management.service";
import {
  CreateStaffManagementDto,
  UpdateStaffManagementDto,
} from "./dto/create-staff-management.dto";
import { StaffManagement } from "./entities/staff-management.entity";
import { StaffManagementService } from "./staff-management.service";
import {
  CreateInventoryManagementDto,
  UpdateInventoryManagementDto,
} from "./dto/create-inventory-management.dto";
import { InventoryManagement } from "./entities/inventory-management.entity";
import { InventoryManagementService } from "./inventory-management.service";

@ApiTags("Availability Management")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({ path: "availability-mgt", version: "1" })
export class AvailabilityManagementController {
  constructor(
    private readonly availabilityManagementService: AvailabilityManagementService,
  ) {}

  @ApiOperation({ summary: "CREATE - Create - Availability" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "You have created Availability.",
  })
  @ApiBody({ type: CreateAvailabilityManagementDto })
  @Post("create-availability/:ownedFranchiseId")
  async createAvailability(
    @Req() req: Request,
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() createAvailabilityManagementDto: CreateAvailabilityManagementDto,
  ): Promise<AvailableManagement> {
    const userId = (req.user as UserEntity).id;
    return this.availabilityManagementService.createAvailability(
      userId,
      ownedFranchiseId,
      createAvailabilityManagementDto,
    );
  }

  @ApiOperation({ summary: "CREATE - Create - Availability Not Auth" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "You have created Availability.",
  })
  @ApiBody({ type: CreateAvailabilityManagementDto })
  @Post("create-availability-no-auth/:ownedFranchiseId")
  async createAvailabilityNoAuth(
    @Req() req: Request,
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() createAvailabilityManagementDto: CreateAvailabilityManagementDto,
  ): Promise<AvailableManagement> {
    return this.availabilityManagementService.createAvailabilityNoAuth(
      ownedFranchiseId,
      createAvailabilityManagementDto,
    );
  }

  @ApiOperation({ summary: "GET - Get All Availabilities for a User" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Retrieved all availabilities for the user.",
  })
  @Get("get-all-availabilities/:userId")
  async getAllAvailability(
    @Req() req: Request,
    @Param("userId") userId: string,
  ): Promise<AvailableManagement[]> {
    return this.availabilityManagementService.getAllAvailability(userId);
  }

  @ApiOperation({ summary: "GET - Get All Availabilities for a Owned" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Retrieved all availabilities for the Owned.",
  })
  @Get("get-all-availabilities-by-owner/:ownedFranchiseId")
  async getAllAvailabilityByOwned(
    @Param("ownedFranchiseId") ownedFranchiseId: string,
  ): Promise<AvailableManagement[]> {
    return this.availabilityManagementService.getAllAvailabilityByOwned(
      ownedFranchiseId,
    );
  }

  @ApiOperation({ summary: "GET - Get Availability by ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Retrieved availability by ID.",
  })
  @Get("get-one-availability/:availabilityId")
  async getOneAvailabiltyById(
    @Param("availabilityId") availabilityId: string,
  ): Promise<AvailableManagement | null> {
    return this.availabilityManagementService.getOneAvailabiltyById(
      availabilityId,
    );
  }

  @ApiOperation({ summary: "UPDATE - Update Availability" })
  @ApiResponse({ status: HttpStatus.OK, description: "Updated availability." })
  @ApiBody({ type: UpdateAvailabilityManagementDto })
  @Put("update-availability/:availabilityId")
  async updateAvailability(
    @Param("availabilityId") availabilityId: string,
    @Body() updateAvailabilityManagementDto: UpdateAvailabilityManagementDto,
  ): Promise<AvailableManagement> {
    return this.availabilityManagementService.updateAvailability(
      availabilityId,
      updateAvailabilityManagementDto,
    );
  }

  @ApiOperation({ summary: "DELETE - Delete Availability" })
  @ApiResponse({ status: HttpStatus.OK, description: "Deleted availability." })
  @Delete("delete-availability/:availabilityId")
  async deleteVenue(
    @Param("availabilityId") availabilityId: string,
  ): Promise<void> {
    return this.availabilityManagementService.deleteAvailability(
      availabilityId,
    );
  }
}

@ApiTags("Unavailable Management")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({ path: "unavailable-mgt", version: "1" })
export class UnavailableManagementController {
  constructor(
    private readonly unavailableManagementService: UnavailableManagementService,
  ) {}

  @ApiOperation({ summary: "CREATE - Create Unavailable Management" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "You have created Unavailable Management.",
  })
  @ApiBody({ type: CreateUnavailableManagementDto })
  @Post("create-unavailable-management/:ownedFranchiseId")
  async createUnavailableManagement(
    @Req() req: Request,
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() createUnavailableManagementDto: CreateUnavailableManagementDto,
  ): Promise<UnavailableManagement> {
    const userId = (req.user as UserEntity).id;
    return this.unavailableManagementService.createUnavailableManagement(
      userId,
      ownedFranchiseId,
      createUnavailableManagementDto,
    );
  }

  @ApiOperation({ summary: "GET - Get All Unavailable Management" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Retrieved all unavailable management.",
  })
  @Get("get-all-unavailable-managements")
  async getAllUnavailableManagement(): Promise<UnavailableManagement[]> {
    return this.unavailableManagementService.getAllUnavailableManagement();
  }

  @ApiOperation({ summary: "GET - Get Unavailable Management by ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Retrieved unavailable management by ID.",
  })
  @Get("get-one-unavailable-management/:unavailableId")
  async getOneUnavailableManagementById(
    @Param("unavailableId") unavailableId: string,
  ): Promise<UnavailableManagement | null> {
    return this.unavailableManagementService.getOneUnavailableManagementById(
      unavailableId,
    );
  }

  @ApiOperation({ summary: "UPDATE - Update Unavailable Management" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Updated unavailable management.",
  })
  @ApiBody({ type: UpdateUnavailableManagementDto })
  @Put("update-unavailable-management/:unavailableId")
  async updateUnavailableManagement(
    @Param("unavailableId") unavailableId: string,
    @Body() updateUnavailableManagementDto: UpdateUnavailableManagementDto,
  ): Promise<UnavailableManagement> {
    return this.unavailableManagementService.updateUnavailableManagement(
      unavailableId,
      updateUnavailableManagementDto,
    );
  }

  @ApiOperation({ summary: "DELETE - Delete Unavailable Management" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Deleted unavailable management.",
  })
  @Delete("delete-unavailable-management/:unavailableId")
  async deleteUnavailableManagement(
    @Param("unavailableId") unavailableId: string,
  ): Promise<void> {
    return this.unavailableManagementService.deleteUnavailableManagement(
      unavailableId,
    );
  }
}

@ApiTags("Customer Management")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("customer-management")
export class CustomerManagementController {
  constructor(
    private readonly customerManagementService: CustomerManagementService,
  ) {}

  @ApiOperation({ summary: "Create a new customer " })
  @ApiResponse({
    status: 201,
    description: "The customer  has been successfully created.",
  })
  @ApiBody({ type: CreateCustomerManagementDto })
  @Post("create-customer/:ownedFranchiseId")
  async createCustomer(
    @Req() req: Request,
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() createCustomerManagementDto: CreateCustomerManagementDto,
  ): Promise<CustomerManagement> {
    const userId = (req.user as UserEntity).id;
    return this.customerManagementService.createCustomer(
      userId,
      ownedFranchiseId,
      createCustomerManagementDto,
    );
  }

  @ApiOperation({ summary: "Retrieve all customer " })
  @ApiResponse({
    status: 200,
    description: "The list of customer  has been successfully retrieved.",
  })
  @Get("get-all-customers/:ownedFranchiseId")
  async getAllCustomer(
    @Req() req: Request,
    @Param("ownedFranchiseId") ownedFranchiseId: string,
  ): Promise<CustomerManagement[]> {
    const userId = (req.user as UserEntity).id;
    return this.customerManagementService.getAllCustomer(
      userId,
      ownedFranchiseId,
    );
  }

  @ApiOperation({ summary: "Retrieve all customer " })
  @ApiResponse({
    status: 200,
    description: "The list of customer  has been successfully retrieved.",
  })
  @Get("get-all-customers")
  async getAllCustomerByUser(
    @Req() req: Request,
  ): Promise<CustomerManagement[]> {
    const userId = (req.user as UserEntity).id;
    return this.customerManagementService.getAllCustomerByUser(userId);
  }

  @ApiOperation({ summary: "Retrieve a customer  by ID" })
  @ApiResponse({
    status: 200,
    description: "The customer  has been successfully retrieved.",
  })
  @Get("get-one-customer/:customerId")
  async getOneCustomerById(
    @Param("customerId") customerId: string,
  ): Promise<CustomerManagement | null> {
    return this.customerManagementService.getOneCustomerById(customerId);
  }

  @ApiOperation({ summary: "Update a customer  by ID" })
  @ApiResponse({
    status: 200,
    description: "The customer  has been successfully updated.",
  })
  @ApiBody({ type: UpdateCustomerManagementDto })
  @Put("update-customer/:customerId")
  async updateCustomer(
    @Param("customerId") customerId: string,
    @Body() updateCustomerManagementDto: UpdateCustomerManagementDto,
  ): Promise<CustomerManagement> {
    return this.customerManagementService.updateCustomer(
      customerId,
      updateCustomerManagementDto,
    );
  }

  @ApiOperation({ summary: "Delete a customer  by ID" })
  @ApiResponse({
    status: 204,
    description: "The customer  has been successfully deleted.",
  })
  @Delete("delete-customer/:customerId")
  async deleteCustomer(@Param("customerId") customerId: string): Promise<void> {
    return this.customerManagementService.deleteCustomer(customerId);
  }
}

@ApiTags("Supplier Management")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("supplier-management")
export class SupplierManagementController {
  constructor(
    private readonly supplierManagementService: SupplierManagementService,
  ) {}

  @ApiOperation({ summary: "Create a new supplier " })
  @ApiResponse({
    status: 201,
    description: "The supplier  has been successfully created.",
  })
  @ApiBody({ type: CreateSupplierManagementDto })
  @Post("create-supplier/:ownedFranchiseId")
  async createSupplier(
    @Req() req: Request,
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() createSupplierManagementDto: CreateSupplierManagementDto,
  ): Promise<SupplierManagement> {
    const userId = (req.user as UserEntity).id;
    return this.supplierManagementService.createSupplier(
      userId,
      ownedFranchiseId,
      createSupplierManagementDto,
    );
  }

  @ApiOperation({ summary: "Retrieve all supplier " })
  @ApiResponse({
    status: 200,
    description: "The list of supplier  has been successfully retrieved.",
  })
  @Get("get-all-suppliers")
  async getAllSupplier(): Promise<SupplierManagement[]> {
    return this.supplierManagementService.getAllSupplier();
  }

  @ApiOperation({ summary: "Retrieve a supplier  by ID" })
  @ApiResponse({
    status: 200,
    description: "The supplier  has been successfully retrieved.",
  })
  @Get("get-one-supplier/:supplierId")
  async getOneSupplierById(
    @Param("supplierId") supplierId: string,
  ): Promise<SupplierManagement | null> {
    return this.supplierManagementService.getOneSupplierById(supplierId);
  }

  @ApiOperation({ summary: "Update a supplier  by ID" })
  @ApiResponse({
    status: 200,
    description: "The supplier  has been successfully updated.",
  })
  @ApiBody({ type: UpdateSupplierManagementDto })
  @Put("update-supplier/:supplierId")
  async updateSupplier(
    @Param("supplierId") supplierId: string,
    @Body() updateSupplierManagementDto: UpdateSupplierManagementDto,
  ): Promise<SupplierManagement> {
    return this.supplierManagementService.updateSupplier(
      supplierId,
      updateSupplierManagementDto,
    );
  }

  @ApiOperation({ summary: "Delete a supplier  by ID" })
  @ApiResponse({
    status: 204,
    description: "The supplier  has been successfully deleted.",
  })
  @Delete("delete-supplier/:supplierId")
  async deleteSupplier(@Param("supplierId") supplierId: string): Promise<void> {
    return this.supplierManagementService.deleteSupplier(supplierId);
  }
}

@ApiTags("Staff Management")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("staff-management")
export class StaffManagementController {
  constructor(
    private readonly staffManagementService: StaffManagementService,
  ) {}

  @ApiOperation({ summary: "Create a new staff " })
  @ApiResponse({
    status: 201,
    description: "The staff  has been successfully created.",
  })
  @ApiBody({ type: CreateStaffManagementDto })
  @Post("create-staff/:ownedFranchiseId")
  async createStaff(
    @Req() req: Request,
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() createStaffManagementDto: CreateStaffManagementDto,
  ): Promise<StaffManagement> {
    const userId = (req.user as UserEntity).id;
    return this.staffManagementService.createStaff(
      userId,
      ownedFranchiseId,
      createStaffManagementDto,
    );
  }

  @ApiOperation({ summary: "Retrieve all staff " })
  @ApiResponse({
    status: 200,
    description: "The list of staff  has been successfully retrieved.",
  })
  @Get("get-all-staffs")
  async getAllStaff(@Req() req: Request): Promise<StaffManagement[]> {
    const userId = (req.user as UserEntity).id;
    return this.staffManagementService.getAllStaff(userId);
  }

  @ApiOperation({ summary: "Retrieve a staff  by ID" })
  @ApiResponse({
    status: 200,
    description: "The staff  has been successfully retrieved.",
  })
  @Get("get-one-staff/:staffId")
  async getOneStaffById(
    @Param("staffId") staffId: string,
  ): Promise<StaffManagement | null> {
    return this.staffManagementService.getOneStaffById(staffId);
  }

  @ApiOperation({ summary: "Update a staff  by ID" })
  @ApiResponse({
    status: 200,
    description: "The staff  has been successfully updated.",
  })
  @ApiBody({ type: UpdateStaffManagementDto })
  @Put("update-staff/:staffId")
  async updateStaff(
    @Param("staffId") staffId: string,
    @Body() updateStaffManagementDto: UpdateStaffManagementDto,
  ): Promise<StaffManagement> {
    return this.staffManagementService.updateStaff(
      staffId,
      updateStaffManagementDto,
    );
  }

  @ApiOperation({ summary: "Delete a staff  by ID" })
  @ApiResponse({
    status: 204,
    description: "The staff  has been successfully deleted.",
  })
  @Delete("delete-staff/:staffId")
  async deleteStaff(@Param("staffId") staffId: string): Promise<void> {
    return this.staffManagementService.deleteStaff(staffId);
  }
}

@ApiTags("Inventory Management")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("inventory-management")
export class InventoryManagementController {
  constructor(
    private readonly inventoryManagementService: InventoryManagementService,
  ) {}

  @ApiOperation({ summary: "Create a new inventory " })
  @ApiResponse({
    status: 201,
    description: "The inventory  has been successfully created.",
  })
  @ApiBody({ type: CreateInventoryManagementDto })
  @Post("create-inventory/:ownedFranchiseId")
  async createInventory(
    @Req() req: Request,
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() createInventoryManagementDto: CreateInventoryManagementDto,
  ): Promise<InventoryManagement> {
    const userId = (req.user as UserEntity).id;
    return this.inventoryManagementService.createInventory(
      userId,
      ownedFranchiseId,
      createInventoryManagementDto,
    );
  }

  @ApiOperation({ summary: "Retrieve all inventory " })
  @ApiResponse({
    status: 200,
    description: "The list of inventory  has been successfully retrieved.",
  })
  @Get("get-all-inventorys")
  async getAllInventory(): Promise<InventoryManagement[]> {
    return this.inventoryManagementService.getAllInventory();
  }

  @ApiOperation({ summary: "Retrieve a inventory  by ID" })
  @ApiResponse({
    status: 200,
    description: "The inventory  has been successfully retrieved.",
  })
  @Get("get-one-inventory/:inventoryId")
  async getOneInventoryById(
    @Param("inventoryId") inventoryId: string,
  ): Promise<InventoryManagement | null> {
    return this.inventoryManagementService.getOneInventoryById(inventoryId);
  }

  @ApiOperation({ summary: "Update a inventory  by ID" })
  @ApiResponse({
    status: 200,
    description: "The inventory  has been successfully updated.",
  })
  @ApiBody({ type: UpdateInventoryManagementDto })
  @Put("update-inventory/:inventoryId")
  async updateInventory(
    @Param("inventoryId") inventoryId: string,
    @Body() updateInventoryManagementDto: UpdateInventoryManagementDto,
  ): Promise<InventoryManagement> {
    return this.inventoryManagementService.updateInventory(
      inventoryId,
      updateInventoryManagementDto,
    );
  }

  @ApiOperation({ summary: "Delete a inventory  by ID" })
  @ApiResponse({
    status: 204,
    description: "The inventory  has been successfully deleted.",
  })
  @Delete("delete-inventory/:inventoryId")
  async deleteInventory(
    @Param("inventoryId") inventoryId: string,
  ): Promise<void> {
    return this.inventoryManagementService.deleteInventory(inventoryId);
  }
}

@ApiTags("Availability Management NOT AUTH")
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: "availability-without-auth", version: "1" })
export class AvailabilityNoAuthManagementController {
  constructor(
    private readonly availabilityManagementService: AvailabilityManagementService,
  ) {}

  @ApiOperation({ summary: "CREATE - Create - Availability Not Auth" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "You have created Availability no auth.",
  })
  @ApiBody({ type: CreateAvailabilityManagementDto })
  @Post("create-availability-no-auth/:ownedFranchiseId")
  async createAvailabilityNoAuth(
    @Req() req: Request,
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() createAvailabilityManagementDto: CreateAvailabilityManagementDto,
  ): Promise<AvailableManagement> {
    return this.availabilityManagementService.createAvailabilityNoAuth(
      ownedFranchiseId,
      createAvailabilityManagementDto,
    );
  }

  @ApiOperation({ summary: "GET - Get All Availabilities" })
  @ApiResponse({ status: HttpStatus.OK, description: "Retrieved all ." })
  @Get("get-all-availability-without-auth")
  async getAllAvailability(): Promise<AvailableManagement[]> {
    return this.availabilityManagementService.getAllAvailabilityNotAuth();
  }
}
