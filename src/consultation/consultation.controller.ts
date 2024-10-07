import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ConsultationService } from "./consultation.service";
import { CreateConsultationTableDto } from "./dto/consultations.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Consultations")
@Controller("consultations")
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @ApiTags("Consultations")
  @ApiOperation({ summary: "Create consultation" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "A user should be able to create consultation",
  })
  @ApiBody({ type: CreateConsultationTableDto })
  @Post("/:ownedFranchiseId")
  async createConsultation(
    @Param("ownedFranchiseId") ownedFranchiseId: string,
    @Body() consultation: CreateConsultationTableDto,
  ) {
    return this.consultationService.createConsultation(
      consultation,
      ownedFranchiseId,
    );
  }

  @ApiTags("Consultations")
  @ApiOperation({ summary: "Get consultations" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Admin can retrieve his/her consultations",
  })
  @Get("/:ownedFranchiseId")
  async getConsultations(@Param("ownedFranchiseId") ownedFranchiseId: string) {
    return this.consultationService.getConsultations(ownedFranchiseId);
  }
}
