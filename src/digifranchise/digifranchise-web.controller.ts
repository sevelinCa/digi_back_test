import { Controller, HttpStatus, HttpCode, Get, Body, Param } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DigifranchiseService } from "./digifranchise.service";

@ApiTags('Digifranchise Web')
@Controller({ path: 'digifranchise', version: '1' })
export class DigifranchiseWebController {
  constructor(
    private readonly digifranchiseService: DigifranchiseService,
  ) { }



  @ApiOperation({ summary: 'GET ALL - Retrieve Digifranchise by Phone number' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('get-digifranchise-info-by-phone-number/:phoneNumber')
  @HttpCode(HttpStatus.OK)
  async getDigifranchiseByPhoneNumber(@Param('phoneNumber') phoneNumber: string) {
    return this.digifranchiseService.getDigifranchiseByPhoneNumber(phoneNumber);
  }

}