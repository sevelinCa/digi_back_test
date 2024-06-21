import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OptionalFunctionalService } from "./optional-functional.service";

@ApiTags("OPTIONAL - FUNCTIONS")
@Controller("optional-functional")
export class OptionalFunctionalController {
  constructor(
    private readonly optionalFunctionalService: OptionalFunctionalService,
  ) {}

  @Delete("delete-user-by-connect-number/:connectNumber")
  async deleteUserByConnectNumber(
    @Param("connectNumber") connectNumber: string,
  ): Promise<void> {
    try {
      await this.optionalFunctionalService.deleteUserByConnectNumber(
        connectNumber,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete("delete-by-franchiseOwner-email/:email")
  async deleteByFranchiseOwnerEmail(@Param("email") email: string): Promise<void> {
    try {
      await this.optionalFunctionalService.deleteByFranchiseOwnerEmail(email);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete("delete-by-user-phoneNumber/:phoneNumber")
  async deleteByUserPhoneNumber(
    @Param("phoneNumber") phoneNumber: string,
  ): Promise<void> {
    try {
      await this.optionalFunctionalService.deleteByUserPhoneNumber(phoneNumber);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Delete("delete-by-user-email/:email")
  async deleteByUserEmail(
    @Param("email") email: string,
  ): Promise<void> {
    try {
      await this.optionalFunctionalService.deleteByUserEmail(email);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
