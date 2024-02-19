import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import type { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import type { Digifranchise } from './entities/digifranchise.entity';
import { Request} from 'express';
import { DigifranchiseService } from './digifranchise.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Digi Franchise')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise', version: '1' })
export class DigifranchiseController {
    constructor(
        private readonly DigifranchiseService: DigifranchiseService,
      ) {}
    
      @Roles(RoleEnum.user)
      @ApiOperation({
        summary: 'CREATE - Create Digi Franchise for USER',
      })
      @Post('create')
      async createDigifranchise(
        @Req() req: Request,
      ): Promise<Digifranchise> {
        const userId = (req.user as UserEntity).id;
        return this.DigifranchiseService.createDigifranchise(userId);
      }
}
