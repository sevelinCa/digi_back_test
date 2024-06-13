<<<<<<< HEAD
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
=======
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
>>>>>>> cb32d997 (delete all by phone number)
import { ApiTags } from "@nestjs/swagger";
import { OptionalFunctionalService } from "./optional-functional.service";

@ApiTags("OPTIONAL - FUNCTIONS")
@Controller("optional-functional")
export class OptionalFunctionalController {
  constructor(
    private readonly optionalFunctionalService: OptionalFunctionalService,
  ) {}
<<<<<<< HEAD

  @Post("delete-user-by-phone-number/:phoneNumber")
  async deleteUserByByPhoneNumber(
    @Param("phoneNumber") phoneNumber: string,
  ): Promise<void> {
    try {
      await this.optionalFunctionalService.deleteUserByPhoneNumber(phoneNumber);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
=======


  @Post('delete-user-by-phone-number/:phoneNumber')
  async deleteUserByByPhoneNumber(@Param('phoneNumber') phoneNumber: string): Promise<void> {
    try {
      await this.optionalFunctionalService.deleteUserByPhoneNumber(phoneNumber);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


>>>>>>> cb32d997 (delete all by phone number)
}
