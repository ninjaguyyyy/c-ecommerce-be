import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, User } from "@prisma/client";

import { GLOBAL_CONFIG } from "configs/global.config";
import { AuthResponseDTO, ForgotPasswordDTO, LoginDTO, ResetPasswordDTO } from "modules/auth/auth.dto";
import { UserService } from "modules/user/user.service";
import { MAIL_TEMPLATES } from "services/mail/mail.constants";
import { MailService } from "services/mail/mail.service";
import { PrismaService } from "services/prisma/prisma.service";
import { MESSAGES } from "shared/constants/messages.constants";
import { AuthHelpers } from "shared/helpers/auth.helpers";

import { RegisterUserDTO } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  public async login(loginUserDTO: LoginDTO, role: Role): Promise<AuthResponseDTO> {
    const userData = await this.userService.findFirst({
      email: loginUserDTO.email,
      role,
    });

    if (!userData) {
      throw new UnauthorizedException(MESSAGES.EU_0000001);
    }

    const isMatch = await AuthHelpers.verify(loginUserDTO.password, userData.password);

    if (!isMatch) {
      throw new UnauthorizedException(MESSAGES.EU_0000001);
    }

    const payload = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: GLOBAL_CONFIG.security.expiresIn,
    });

    return {
      user: payload,
      accessToken: accessToken,
    };
  }

  public async register(user: RegisterUserDTO): Promise<User> {
    const createdUser = await this.userService.create(user, false);

    return createdUser;
  }

  public async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const { email } = dto;
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new BadRequestException(MESSAGES.EU_0000003);
    }

    this.mailService.sendEmail(email, MAIL_TEMPLATES.RESET_PASSWORD, {
      link: `${GLOBAL_CONFIG.external.frontend_url}/reset-password/${user.token}`,
    });

    return;
  }

  public async resetPassword(dto: ResetPasswordDTO): Promise<User> {
    const { token, password } = dto;
    const isExisting = await this.userService.checkExistingToken(token);
    if (!isExisting) {
      throw new BadRequestException(MESSAGES.EU_0000005);
    }

    const encryptedPass = await AuthHelpers.hash(password);
    const user = await this.userService.update({
      where: { token },
      data: { password: encryptedPass },
    });

    return user;
  }

  public async verifyToken(token: string): Promise<void> {
    const isExisting = await this.userService.checkExistingToken(token);
    if (!isExisting) {
      throw new BadRequestException(MESSAGES.EU_0000005);
    } else {
      await this.userService.update({
        where: { token },
        data: { emailVerifiedAt: new Date() },
      });
    }
  }
}
