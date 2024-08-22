import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/roles.guard";
import { QuotationsService } from "./quotations.service";
import { CreateQuotationDto } from "./dto/create-quotation.dto";
import { UpdateQuotationDto } from "./dto/update-quotation.dto";
import { QuotationEntity } from "./entities/quotation.entity";
import { QuotationRequest } from "./entities/quotation-request.entity";
import { CreateQuotationRequestDto } from "./dto/create-quotation-request.dto";

@ApiTags("Quotations")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("quotations")
export class QuotationsController {
  constructor(private readonly quotationService: QuotationsService) {}

  @Post("/request")
  @ApiOperation({ summary: "Create a new quotation Request" })
  @ApiResponse({
    status: 201,
    description: "The quotation Request has been successfully created.",
    type: QuotationRequest,
  })
  @ApiBody({ type: CreateQuotationRequestDto })
  createQuotationRequest(
    @Body() createQuotationRequest: CreateQuotationRequestDto
  ) {
    return this.quotationService.createQuotationRequest(createQuotationRequest);
  }

  @Post()
  @ApiOperation({ summary: "Create a new quotation" })
  @ApiResponse({
    status: 201,
    description: "The quotation has been successfully created.",
    type: QuotationEntity,
  })
  @ApiBody({ type: CreateQuotationDto })
  create(@Body() createQuotationDto: CreateQuotationDto) {
    return this.quotationService.createQuotation(createQuotationDto);
  }
  @Put(":id")
  @ApiOperation({ summary: "Update an existing quotation" })
  @ApiParam({ name: "id", description: "ID of the quotation to update" })
  @ApiResponse({
    status: 200,
    description: "The quotation has been successfully updated.",
    type: QuotationEntity,
  })
  update(
    @Param("id") id: string,
    @Body() updateQuotationDto: UpdateQuotationDto
  ) {
    return this.quotationService.updateQuotation(id, updateQuotationDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a quotation" })
  @ApiParam({ name: "id", description: "ID of the quotation to delete" })
  @ApiResponse({
    status: 204,
    description: "The quotation has been successfully deleted.",
  })
  remove(@Param("id") id: string) {
    return this.quotationService.deleteQuotation(id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single quotation by ID" })
  @ApiParam({ name: "id", description: "ID of the quotation to retrieve" })
  @ApiResponse({
    status: 200,
    description: "The quotation has been successfully retrieved.",
    type: QuotationEntity,
  })
  findOne(@Param("id") id: string) {
    return this.quotationService.getQuotationById(id);
  }
  @Get()
  @ApiOperation({ summary: "Get all quotations" })
  @ApiResponse({
    status: 200,
    description: "The quotations have been successfully retrieved.",
    type: [QuotationEntity],
  })
  findAll() {
    return this.quotationService.getAllQuotations();
  }
}
