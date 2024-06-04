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
  Patch,
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
import { DigifranchiseProfessionalBodyMembershipService } from "./digranchise-professional-body-membership.service";
import { DigifranchiseProfessionalBodyMembership } from "./entities/digifranchise-professional-body-membership.entity";
import {
  AddProfessionalMembershipDto,
  UpdateProfessionalMembershipDto,
} from "./dto/add-digifranchise-professional-membership.dto";

@ApiTags("Digifranchise Professional Membership")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({ path: "digifranchise", version: "1" })
export class DigifranchiseProfessionalMembershipController {
  constructor(
    private readonly digifranchiseProfessionalMembershipService: DigifranchiseProfessionalBodyMembershipService
  ) {}

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({
    summary:
      "GET - Get professional memberships information of the digifranchise",
  })
  @ApiResponse({ status: HttpStatus.OK })
  @Get("get-professional-memberships-info")
  @HttpCode(HttpStatus.OK)
  async getProfessionalMembershipsInfo(
    @Query("ownedDigifranchiseId") ownedDigifranchiseId: string
  ): Promise<any[]> {
    return this.digifranchiseProfessionalMembershipService.getDigifranchiseProfessionalMemberships(
      ownedDigifranchiseId
    );
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({
    summary:
      "POST - Add professional memberships information of the digifranchise",
  })
  @ApiResponse({ status: HttpStatus.OK })
  @Post("add-professional-memberships-info")
  @HttpCode(HttpStatus.OK)
  async addProfessionalMembership(
    @Query("ownedDigifranchiseId") ownedDigifranchiseId: string,
    @Body() dto: AddProfessionalMembershipDto
  ): Promise<DigifranchiseProfessionalBodyMembership> {
    return this.digifranchiseProfessionalMembershipService.addDigifranchiseProfessionalMembership(
      ownedDigifranchiseId,
      dto
    );
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({
    summary:
      "PATCH - Update professional membership information of the digifranchise",
  })
  @ApiResponse({ status: HttpStatus.OK })
  @Patch("update-professional-memberships-info/:membershipId")
  @HttpCode(HttpStatus.OK)
  async updateProfessionalMembership(
    @Query("ownedDigifranchiseId") ownedDigifranchiseId: string,
    @Param("membershipId") membershipId: string,
    @Body() updateDto: UpdateProfessionalMembershipDto
  ): Promise<DigifranchiseProfessionalBodyMembership> {
    return this.digifranchiseProfessionalMembershipService.updateDigifranchiseProfessionalMembership(
      ownedDigifranchiseId,
      membershipId,
      updateDto
    );
  }
}
