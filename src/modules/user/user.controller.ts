import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { User } from "@prisma/client";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { BLACK_LIST_FIELDS, Role } from "shared/constants/global.constants";
import { UserService } from "modules/user/user.service";
import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { IdParamDTO } from "shared/dtos/base-pagination-request.dto";
import { RegisterUserDTO } from "modules/auth/auth.dto";
import { CommonHelpers } from "shared/helpers/common.helpers";
import { BasePaginationResponseDTO } from "shared/dtos/base-pagination-response.dto";

import { UserListRequestDTO } from "./dtos/user-request.dto";
import { UserDetailResponseDTO, UserListResponseDTO } from "./dtos/user-response.dto";

@ApiTags("users")
@Controller("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HasRoles(Role.PUBLIC)
  @ApiOkResponse({ type: [UserListResponseDTO] })
  async getAll(@Query() query: UserListRequestDTO): Promise<UserListResponseDTO[]> {
    return await this.userService.findAll(query);
  }

  @Get("/count")
  @HasRoles(Role.ADMIN)
  @ApiOkResponse({ type: BasePaginationResponseDTO })
  async count(): Promise<BasePaginationResponseDTO> {
    return await this.userService.count();
  }

  @Get(":id")
  @HasRoles(Role.ADMIN)
  @ApiOkResponse({ type: UserDetailResponseDTO })
  async getUserById(@Param() params: IdParamDTO): Promise<UserDetailResponseDTO> {
    const user = await this.userService.findById(params.id);

    return user;
  }

  @Post()
  @HasRoles(Role.ADMIN)
  async create(@Body() user: RegisterUserDTO): Promise<User> {
    const registeredUser = await this.userService.create(user, true);
    CommonHelpers.removeBlacklistFields(registeredUser, BLACK_LIST_FIELDS);

    return registeredUser;
  }

  @Put(":id")
  @HasRoles(Role.ADMIN)
  async update(@Param() params: IdParamDTO, @Body() user: RegisterUserDTO): Promise<User> {
    const updatedUser = await this.userService.updateUserById(params.id, user);
    CommonHelpers.removeBlacklistFields(updatedUser, BLACK_LIST_FIELDS);

    return updatedUser;
  }

  @Delete(":id")
  @HasRoles(Role.ADMIN)
  async delete(@Param() params: IdParamDTO): Promise<void> {
    await this.userService.delete(params.id);
  }
}
