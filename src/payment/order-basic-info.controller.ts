import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from "@nestjs/swagger";
import { OrderBasicInfoService } from "./order-basic-info.service";
import { CreateOrderBasicInfo } from "./dto/order.dto";
import { OrderBasicInfo } from "./entities/order.entity";

@ApiTags("Order - Basic Info")
// @ApiBearerAuth()
@Controller({ path: "order-basic-info", version: "1" })
export class OrderBasicInfoController {
  constructor(private readonly orderBasicInfoService: OrderBasicInfoService) {}

  @ApiOperation({ summary: "CREATE - Create a new order basic info" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "A new order basic info has been successfully created.",
  })
  @ApiBody({ type: CreateOrderBasicInfo })
  @Post("create/:orderId")
  async createOrderBasicInfo(
    @Param("orderId") orderId: string,
    @Body() createOrderBasicInfo: CreateOrderBasicInfo,
  ): Promise<OrderBasicInfo> {
    return this.orderBasicInfoService.createOrderBasicInfo(
      createOrderBasicInfo,
      orderId,
    );
  }

  @ApiOperation({ summary: "GET - Retrieve all order basic info" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "All order basic info retrieved successfully.",
  })
  @Get("all")
  async getAllBasicInfo(): Promise<OrderBasicInfo[]> {
    return this.orderBasicInfoService.getAllBasicInfo();
  }

  @ApiOperation({
    summary: "GET - Retrieve a single order basic info by its ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Order basic info retrieved successfully.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Order basic info not found.",
  })
  @Get(":basicInfoId")
  async getBasicInfoById(
    @Param("basicInfoId") basicInfoId: string,
  ): Promise<OrderBasicInfo> {
    return this.orderBasicInfoService.getBasicInfoId(basicInfoId);
  }
}
