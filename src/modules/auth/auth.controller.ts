import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "@prisma/client";

import { BLACK_LIST_FIELDS, Role } from "shared/constants/global.constants";
import { CommonHelpers } from "shared/helpers/common.helpers";
import { HasRoles } from "modules/auth/auth.has-roles.decorator";

import { AuthService } from "./auth.service";
import { AuthResponseDTO, ForgotPasswordDTO, LoginDTO, ResetPasswordDTO } from "./auth.dto";
import { PhoneDTO, RegisterUserDTO, VerifyPhoneDTO } from "./auth.dto";

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

  @Post("/user/send-otp")
  @HasRoles(Role.PUBLIC)
  async sendOtp(@Body() data: PhoneDTO): Promise<void> {
    await this.authService.sendOtp(data);
  }

  @Post("/user/verify-otp")
  @HttpCode(200)
  @HasRoles(Role.PUBLIC)
  async verifyOtp(@Body() data: VerifyPhoneDTO): Promise<void> {
    await this.authService.verifyOtp(data);
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
