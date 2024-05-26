import {
  Controller,
  HttpStatus,
  HttpCode,
  Get,
  Body,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { DigifranchiseService } from "./digifranchise.service";
import { Roles } from "src/roles/roles.decorator";
import { RoleEnum } from "src/roles/roles.enum";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/roles.guard";

@ApiTags("Digifranchise Web")
@Controller({ path: "digifranchise", version: "1" })
export class DigifranchiseWebController {
  constructor(private readonly digifranchiseService: DigifranchiseService) {}

  @ApiOperation({ summary: "GET ALL - Retrieve Digifranchise by Phone number" })
  @ApiResponse({ status: HttpStatus.OK })
  @Get("get-digifranchise-info-by-phone-number/:phoneNumber")
  @HttpCode(HttpStatus.OK)
  async getDigifranchiseByPhoneNumber(
    @Param("phoneNumber") phoneNumber: string,
  ) {
    return this.digifranchiseService.getDigifranchiseByPhoneNumber(phoneNumber);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: "POST - Publish your Digifranchise" })
  @ApiResponse({ status: HttpStatus.OK })
  @Post("publish-digifranchise")
  @HttpCode(HttpStatus.OK)
  async publishDigifranchise(
    @Query("digifranchiseId") digifranchiseId: string,
  ) {
    return this.digifranchiseService.publishDigifranchiseWeb(digifranchiseId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: "POST - Unpublish your Digifranchise" })
  @ApiResponse({ status: HttpStatus.OK })
  @Post("unpublish-digifranchise")
  @HttpCode(HttpStatus.OK)
  async unPublishDigifranchise(
    @Query("digifranchiseId") digifranchiseId: string,
  ) {
    return this.digifranchiseService.unPublishDigifranchiseWeb(digifranchiseId);
  }
}
