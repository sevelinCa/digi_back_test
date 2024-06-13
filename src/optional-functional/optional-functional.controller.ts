import {
  Body,
  Controller,
  Delete,
  Get,

  Param,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OptionalFunctionalService } from "./optional-functional.service";

@ApiTags("OPTIONAL - FUNCTIONS")
@Controller("optional-functional")
export class OptionalFunctionalController {
  constructor(
    private readonly optionalFunctionalService: OptionalFunctionalService
  ) {}
  @Delete('owner/:phoneNumber')
  async removeOwner(@Param('phoneNumber') phoneNumber: string): Promise<void> {
    return this.optionalFunctionalService.removeOwnerByPhoneNumber(phoneNumber);
  }

}
