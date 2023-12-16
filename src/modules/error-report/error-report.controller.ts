import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ErrorReportService } from "modules/error-report/error-report.service";
import { Role } from "shared/constants/global.constants";
import { HasRoles } from "modules/auth/auth.has-roles.decorator";

@ApiTags("error-report")
@Controller("/error-report")
export class ErrorReportController {
  constructor(private reportService: ErrorReportService) {
  }

  @Post("")
  @HasRoles(Role.PUBLIC)
  async report(
    @Body() error: Error,
  ): Promise<void> {
    return this.reportService.report(error);
  }
}
