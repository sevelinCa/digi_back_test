import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  NotFoundException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/roles.guard";
import { Roles } from "src/roles/roles.decorator";
import { RoleEnum } from "src/roles/roles.enum";
import { DigifranchiseService } from "./digifranchise.service";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Request } from "express";
import { UpdateDigifranchiseComplianceInfoDto } from "./dto/update-digifranchise-compliance-info.dto";
import { DigifranchiseComplianceInfoService } from "./digifranchise-compliance-information.service";
import { DigifranchiseComplianceInfo } from "./entities/digifranchise-compliance-information.entity";

@ApiTags("Digifranchise Compliance Info")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({ path: "digifranchise", version: "1" })
export class DigifranchiseComplianceInfoController {
  constructor(
    private readonly digifranchiseComplainceInfoService: DigifranchiseComplianceInfoService,
  ) {}
  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({
    summary: "GET - Get complaince information of the digifranchise",
  })
  @ApiResponse({ status: HttpStatus.OK })
  @Get("get-compliance-info")
  @HttpCode(HttpStatus.OK)
  async getDigifranchiseComplainceInfo(
    @Req() req: Request,
    @Query("ownedDigifranchiseId") ownedDigifranchiseId: string,
  ): Promise<DigifranchiseComplianceInfo> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseComplainceInfoService.getDigifranchiseComplianceInformation(
      userId,
      ownedDigifranchiseId,
    );
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({
    summary: "UPDATE - Update compliance information of the digifranchise",
  })
  @Put("update-complaince-info")
  @HttpCode(HttpStatus.OK)
  async updateDigifranchiseComplianceInfo(
    @Req() req: Request,
    @Body()
    updateDigifranchiseComplianceInfo: UpdateDigifranchiseComplianceInfoDto,
    @Query("ownedDigifranchiseId") ownedDigifranchiseId: string,
  ): Promise<DigifranchiseComplianceInfo> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseComplainceInfoService.updateDigifranchiseComplianceInformation(
      userId,
      updateDigifranchiseComplianceInfo,
      ownedDigifranchiseId,
    );
  }
}
