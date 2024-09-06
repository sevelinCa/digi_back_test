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
  ParseUUIDPipe,
  HttpException,
} from "@nestjs/common";
import { Roles } from "src/roles/roles.decorator";
import { RoleEnum } from "src/roles/roles.enum";
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
@Controller("quotations")
export class QuotationsController {
  constructor(private readonly quotationService: QuotationsService) {}

  @Post("/request/:ownedDigifranchiseId")
  @ApiOperation({ summary: "Create a new quotation Request" })
  @ApiResponse({
    status: 201,
    description: "The quotation Request has been successfully created.",
    type: QuotationRequest,
  })
  @ApiBody({ type: CreateQuotationRequestDto })
  @HttpCode(HttpStatus.CREATED)
  createQuotationRequest(
    @Param("ownedDigifranchiseId") ownedDigifranchiseId: string,
    @Body() createQuotationRequest: CreateQuotationRequestDto
  ) {
    return this.quotationService.createQuotationRequest(
      createQuotationRequest,
      ownedDigifranchiseId
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: "Get all quotation Requests" })
  @ApiResponse({
    status: 200,
    description: "Quotation Requests have been successfully retrieved.",
    type: [QuotationRequest],
  })
  @Get("/requests/:ownedDigifranchiseId")
  async findAllRequests(
    @Param(
      "ownedDigifranchiseId",
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      })
    )
    ownedDigifranchiseId: string
  ) {
    return this.quotationService.findAllRequests(ownedDigifranchiseId);
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

  @Get(":id")
  @ApiOperation({ summary: "Get a single quotation by ID" })
  @ApiParam({ name: "id", description: "ID of the quotation to retrieve" })
  @ApiResponse({
    status: 200,
    description: "The quotation has been successfully retrieved.",
    type: QuotationEntity,
  })
  findOne(
    @Param(
      "id",
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })
    )
    id: string
  ) {
    return this.quotationService.getQuotationById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(RoleEnum.digifranchise_super_admin)
  @Get(":ownedDigifranchiseId")
  @ApiOperation({ summary: "Get all quotations" })
  @ApiResponse({
    status: 200,
    description: "The quotations have been successfully retrieved.",
    type: [QuotationEntity],
  })
  async findAll(
    @Param(
      "ownedDigifranchiseId",
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })
    )
    ownedDigifranchiseId: string
  ) {
    return await this.quotationService.getAllQuotations(ownedDigifranchiseId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(RoleEnum.digifranchise_super_admin)
  @Delete(":id")
  @ApiOperation({ summary: "Delete a quotation" })
  @ApiParam({ name: "id", description: "ID of the quotation to delete" })
  @ApiResponse({
    status: 204,
    description: "The quotation has been successfully deleted.",
  })
  remove(
    @Param(
      "id",
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })
    )
    id: string
  ) {
    return this.quotationService.deleteQuotation(id);
  }

  @Get("/request/:id")
  @ApiOperation({ summary: "Get a single quotation request by ID" })
  @ApiParam({
    name: "id",
    description: "ID of the quotation request to retrieve",
  })
  @ApiResponse({
    status: 200,
    description: "The quotation request id has been successfully retrieved.",
    type: QuotationEntity,
  })
  findRequestById(
    @Param(
      "id",
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })
    )
    id: string
  ) {
    return this.quotationService.getQuotationRequestById(id);
  }
}
