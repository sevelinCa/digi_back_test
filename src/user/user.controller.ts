import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  Patch,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBody, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { UserProfileDto } from "./dto/user.profile.dto";
import { UserService } from "./user.service";
import { infinityPagination } from "src/utils/infinity-pagination";
import { User } from "src/users/domain/user";
import { Roles } from "src/roles/roles.decorator";
import { RoleEnum } from "src/roles/roles.enum";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/roles.guard";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: UserProfileDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  create(@Request() request, @Body() createUserProfileDto: UserProfileDto) {
    return this.userService.createProfile(request.user, createUserProfileDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(RoleEnum.admin)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.userService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  // @SerializeOptions({
  //     groups: ['admin'],
  // })
  // @Get(':id')
  // @HttpCode(HttpStatus.OK)
  // @ApiParam({
  //     name: 'id',
  //     type: String,
  //     required: true,
  // })
  // findOne(@Param('id') id: User['id']) {
  //     return this.userService.findOne({ id });
  // }

  // @ApiBearerAuth()
  // @Patch()
  // @ApiBody({ type: UserProfileDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  async update(
    @Body() updateUserProfileDto: UserProfileDto,
    @Request() request,
  ) {
    const user = await this.userService.updateProfile(
      request.user,
      updateUserProfileDto,
    );
    return {
      data: user,
      message: "Update is successfull",
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(RoleEnum.admin)
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  async remove(@Param("id") id: User["id"]) {
    await this.userService.softDelete(id);

    return {
      message: "deleted successfull",
    };
  }
}
