import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { MailService } from "services/mail/mail.service";
import { UserService } from "modules/user/user.service";
import { JWT_SECRET } from "shared/constants/global.constants";
import { PrismaModule } from "services/prisma/prisma.module";
import { PrismaService } from "services/prisma/prisma.service";
import { UserRepo } from "modules/user/user.repo";

import { JwtStrategy } from "./auth.jwt.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
    }),
    PrismaModule,
  ],
  providers: [
    UserRepo,
    UserService,
    AuthService,
    JwtStrategy,
    PrismaService,
    MailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
