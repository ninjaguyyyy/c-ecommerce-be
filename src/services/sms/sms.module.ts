import { Module } from "@nestjs/common";

import { SMSService } from "services/sms/sms.service";

@Module({
  providers: [SMSService],
  exports: [SMSService],
})
export class SMSModule {}
