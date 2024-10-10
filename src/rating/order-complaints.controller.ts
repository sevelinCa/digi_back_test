import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { RolesGuard } from "src/roles/roles.guard";
import { CreateOrderComplaintsDto } from "./dto/Complaints.dto";
import { OrderComplaintsTable } from "./entities/Complaints.entity";
import { OrderComplaintsService } from "./order-complaints.service";
import { getOrderUserNamesAndEmailWithOwnerEmail } from "src/helper/Enquiry-complement-helper-functions";

@ApiTags("Order - Complaints")
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: "order-complaints", version: "1" })
export class OrderComplaintsController {
  constructor(
    private readonly orderComplaintsService: OrderComplaintsService,
  ) {}

  @ApiOperation({ summary: "CREATE - Create a new order complait" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "A new order complait has been successfully created.",
  })
  @ApiBody({ type: CreateOrderComplaintsDto })
  @Post("create-order-complain/:orderId")
  async createRatingOrder(
    @Body() createOrderComplaintsDto: CreateOrderComplaintsDto,
    @Query("orderId") orderId: string,
  ): Promise<OrderComplaintsTable> {
    return this.orderComplaintsService.createOrderComplaint(
      orderId,
      createOrderComplaintsDto,
    );
  }

  @ApiOperation({ summary: "GET - Retrieve all order complaints" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "All order complaints retrieved successfully.",
  })
  @Get("all")
  async getAllOrderComplaint(): Promise<OrderComplaintsTable[]> {
    return this.orderComplaintsService.getAllOrderComplaint();
  }

  @Get('get-user-names-and-email-with-owner/:orderId')
  async getUserNamesAndEmailWithOwner(@Param('orderId') orderId: string) {
    const result = await this.orderComplaintsService.getOrderUserNamesAndEmailWithOwnerEmail(orderId);
    return result;
  }
}
