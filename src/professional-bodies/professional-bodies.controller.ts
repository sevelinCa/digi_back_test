import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { ProfessionalBodiesService } from './professional-bodies.service';
import { RoleEnum } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';
import { ProfessionalBodyEntity } from './entities/professional-body.entity';


@ApiTags('Professional Bodies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: '', version: '1' })
@Controller('professional-bodies')
export class ProfessionalBodiesController {
  constructor(
    private readonly professionalBodyService: ProfessionalBodiesService,
  ) {}

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET - Get professional bodies' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('get-professional-bodies')
  @HttpCode(HttpStatus.OK)
  async getProfessionalBodies(): Promise<ProfessionalBodyEntity[]> {
    // const professionalBodies = await this.
    return this.professionalBodyService.getProfessionalBodies();
  }
}
