import { Module } from "@nestjs/common";

import { PrismaService } from "services/prisma/prisma.service";
import { Logger } from "services/logger/logger.service";

@Module({
  providers: [PrismaService, Logger],
  exports: [PrismaService, Logger],
})
export class PrismaModule {}
