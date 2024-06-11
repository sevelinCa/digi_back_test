import { Controller, Delete, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OptionalFunctionalService } from './optional-functional.service';

@ApiTags("OPTIONAL - FUNCTIONS")
@Controller('optional-functional')
export class OptionalFunctionalController {
    constructor(private readonly optionalFunctionalService: OptionalFunctionalService) {}

    @Delete('delete-all-by-number/:connectNumber')
    async deleteAllByConnectNumber(@Param('connectNumber') connectNumber: string): Promise<void> {
      try {
        await this.optionalFunctionalService.deleteAllByConnectNumber(connectNumber);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
}
