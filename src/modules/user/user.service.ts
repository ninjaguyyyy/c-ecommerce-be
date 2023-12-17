import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, Role, User } from "@prisma/client";
import { plainToInstance } from "class-transformer";

import { GLOBAL_CONFIG } from "configs/global.config";
import { RegisterUserDTO } from "modules/auth/auth.dto";
import { UserRepo } from "modules/user/user.repo";
import { MAIL_TEMPLATES } from "services/mail/mail.constants";
import { MailService } from "services/mail/mail.service";
import { MESSAGES } from "shared/constants/messages.constants";
import { BasePaginationResponseDTO } from "shared/dtos/base-pagination-response.dto";
import { AuthHelpers } from "shared/helpers/auth.helpers";

import { UserListRequestDTO } from "./dtos/user-request.dto";
import { UserDetailResponseDTO, UserListResponseDTO } from "./dtos/user-response.dto";

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepo, private mailService: MailService) {}

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.userRepo.findOne(userWhereUniqueInput);
  }

  async findById(id: number): Promise<UserDetailResponseDTO> {
    const user = await this.findExistingUserById(id);

    return plainToInstance(UserDetailResponseDTO, user, { excludeExtraneousValues: true });
  }

  async findFirst(where: Prisma.UserWhereInput): Promise<User | null> {
    return this.userRepo.findFirst(where);
  }

  async findAll(query: UserListRequestDTO): Promise<UserListResponseDTO[]> {
    const data = await this.userRepo.findAll({});

    const userList = plainToInstance(UserListResponseDTO, data, { excludeExtraneousValues: true });

    return userList;
  }

  async count(): Promise<BasePaginationResponseDTO> {
    const countData = await this.userRepo.count({ role: Role.User });

    return BasePaginationResponseDTO.convertToPaginationResponse(countData);
  }

  async create(user: RegisterUserDTO, isSystem: boolean): Promise<User> {
    if (await this.checkExistingEmail(user.email)) {
      throw new BadRequestException(MESSAGES.EU_0000002);
    }

    if (await this.checkExistingPhone(user.phone)) {
      throw new BadRequestException(MESSAGES.EU_0000007);
    }

    const token = AuthHelpers.generateToken();
    const newUser = {
      ...user,
      token,
      emailVerifiedAt: isSystem ? new Date() : undefined,
    };

    const createdUser = await this.userRepo.create(newUser);

    if (!isSystem) {
      this.mailService.sendEmail(user.email, MAIL_TEMPLATES.VERIFY_ACCOUNT, {
        name: user.name,
        link: `${GLOBAL_CONFIG.external.frontend_url}/verify/${token}`,
      });
    }

    return createdUser;
  }

  async update(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    const { where, data } = params;
    return this.userRepo.update({
      data,
      where,
    });
  }

  async updateUserById(id: number, data: RegisterUserDTO): Promise<User> {
    const user = await this.findExistingUserById(id);

    const existingEmailUser = await this.userRepo.findFirst({
      AND: [
        {
          NOT: {
            id: user.id,
          },
        },
        {
          email: data.email,
        },
      ],
    });

    if (existingEmailUser) {
      throw new BadRequestException(MESSAGES.EU_0000002);
    }

    const existingPhoneUser = await this.userRepo.findFirst({
      AND: [
        {
          NOT: {
            id: user.id,
          },
        },
        {
          phone: data.phone,
        },
      ],
    });

    if (existingPhoneUser) {
      throw new BadRequestException(MESSAGES.EU_0000007);
    }

    return this.update({ where: { id: user.id }, data: data });
  }

  async delete(id: number): Promise<void> {
    const user = await this.findExistingUserById(id);

    await this.userRepo.delete({ id: user.id });
  }

  private async findExistingUserById(id: number): Promise<User> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new BadRequestException(MESSAGES.EU_0000015);
    }

    return user;
  }

  async checkExistingEmail(email: string): Promise<boolean> {
    const user = await this.findOne({ email });
    return !!user;
  }

  async checkExistingPhone(phone: string): Promise<boolean> {
    const user = await this.findOne({ phone });
    return !!user;
  }

  async checkExistingToken(token: string): Promise<boolean> {
    const user = await this.findOne({ token });
    return !!user;
  }
}
