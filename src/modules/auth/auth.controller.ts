import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "@prisma/client";

import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { BLACK_LIST_FIELDS, Role } from "shared/constants/global.constants";
import { CommonHelpers } from "shared/helpers/common.helpers";

import { AuthResponseDTO, ForgotPasswordDTO, LoginDTO, RegisterUserDTO, ResetPasswordDTO } from "./auth.dto";
import { AuthService } from "./auth.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/user/login")
  @HasRoles(Role.PUBLIC)
  @ApiOperation({ description: "Login in user" })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ type: AuthResponseDTO })
  async loginUser(@Body() user: LoginDTO): Promise<AuthResponseDTO> {
    return this.authService.login(user, Role.USER);
  }

  @Post("/user/register")
  @HasRoles(Role.PUBLIC)
  async register(@Body() user: RegisterUserDTO): Promise<User> {
    const registeredUser = await this.authService.register(user);
    CommonHelpers.removeBlacklistFields(registeredUser, BLACK_LIST_FIELDS);
    return registeredUser;
  }

  @Post("/user/forgot-password")
  @HasRoles(Role.PUBLIC)
  @ApiBody({ type: ForgotPasswordDTO })
  forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDTO);
  }

  @Post("/user/reset-password")
  @HasRoles(Role.PUBLIC)
  @ApiBody({ type: ResetPasswordDTO })
  resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO): Promise<User> {
    return this.authService.resetPassword(resetPasswordDTO);
  }

  @Get("/user/verify/:token")
  @HasRoles(Role.PUBLIC)
  verifyToken(@Param("token") token: string): Promise<void> {
    return this.authService.verifyToken(token);
  }

  @Post("/admin/login")
  @HasRoles(Role.PUBLIC)
  @ApiOperation({ description: "Login in admin" })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ type: AuthResponseDTO })
  async loginAdmin(@Body() user: LoginDTO): Promise<AuthResponseDTO> {
    return this.authService.login(user, Role.ADMIN);
  }
}
