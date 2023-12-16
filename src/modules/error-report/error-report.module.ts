import { Module } from "@nestjs/common";

import { ErrorReportController } from "modules/error-report/error-report.controller";
import { ErrorReportService } from "modules/error-report/error-report.service";
import { Logger } from "services/logger/logger.service";

@Module({
  controllers: [ErrorReportController],
  providers: [ErrorReportService, Logger],
  exports: [ErrorReportService],
})
export class ErrorReportModule {
}
