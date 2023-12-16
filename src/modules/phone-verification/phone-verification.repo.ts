import { Injectable } from "@nestjs/common";
import { PhoneVerification, Prisma } from "@prisma/client";

import { PrismaService } from "services/prisma/prisma.service";

@Injectable()
export class PhoneVerificationRepo {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PhoneVerificationCreateInput): Promise<PhoneVerification> {
    return this.prisma.phoneVerification.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.PhoneVerificationWhereUniqueInput;
    data: Prisma.PhoneVerificationUpdateInput;
  }): Promise<PhoneVerification> {
    const { where, data } = params;
    return this.prisma.phoneVerification.update({
      data,
      where,
    });
  }
}
