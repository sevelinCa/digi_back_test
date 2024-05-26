import {
  Body,
  Controller,
  Req,
  UseGuards,
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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/roles.guard";
import { Roles } from "src/roles/roles.decorator";
import { RoleEnum } from "src/roles/roles.enum";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Request } from "express";
import { DigifranchiseGeneralInfoService } from "./digifranchise-general-information.service";
import { DigifranchiseGeneralInfo } from "./entities/digifranchise-general-information.entity";
import { UpdateDigifranchiseGeneralInfoDto } from "./dto/update-digifranchise-general-info.dto";

@ApiTags("Digifranchise General Info")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({ path: "digifranchise", version: "1" })
export class DigifranchiseGeneralInfoController {
  constructor(
    private readonly digifranchiseGeneralInfoService: DigifranchiseGeneralInfoService,
  ) {}
  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({
    summary: "GET - Get general information of the digifranchise",
  })
  @ApiResponse({ status: HttpStatus.OK })
  @Get("get-general-info")
  @HttpCode(HttpStatus.OK)
  async getDigifranchiseGeneralInfo(
    @Req() req: Request,
    @Query("ownedDigifranchiseId") ownedDigifranchiseId: string,
  ): Promise<DigifranchiseGeneralInfo> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseGeneralInfoService.getDigifranchiseGeneralInformation(
      userId,
      ownedDigifranchiseId,
    );
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({
    summary: "UPDATE - Update general information of the digifranchise",
  })
  @Put("update-general-info")
  @HttpCode(HttpStatus.OK)
  async updateDigifranchiseGeneralInfo(
    @Req() req: Request,
    @Body() updateDigifranchiseGeneralInfo: UpdateDigifranchiseGeneralInfoDto,
    @Query("ownedDigifranchiseId") ownedDigifranchiseId: string,
  ): Promise<DigifranchiseGeneralInfo> {
    const userId = (req.user as UserEntity).id;
    return this.digifranchiseGeneralInfoService.updateDigifranchiseGeneralInformation(
      userId,
      updateDigifranchiseGeneralInfo,
      ownedDigifranchiseId,
    );
  }
}
