import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

import { UserListener } from "modules/user/user.listener";
import { PRISMA_CLIENT_OPTIONS } from "services/prisma/prisma.config";
import { Logger } from "services/logger/logger.service";

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, "error" | "query">
  implements OnModuleInit, OnModuleDestroy {
  constructor(private logger: Logger) {
    super({ ...PRISMA_CLIENT_OPTIONS });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on("error", (e) => {
      this.logger.error(e.message);
    });

    this.$use(UserListener.onCreated);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
