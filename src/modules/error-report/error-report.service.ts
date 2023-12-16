import { Injectable } from "@nestjs/common";

import { Logger } from "services/logger/logger.service";

@Injectable()
export class ErrorReportService {
  constructor(private logger: Logger) {
  }

  async report(error: Error): Promise<void> {
    return this.logger.error(error.message, error.stack);
  }
}
