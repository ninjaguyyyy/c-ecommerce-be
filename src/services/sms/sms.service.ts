import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { Injectable } from "@nestjs/common";

import { GLOBAL_CONFIG } from "configs/global.config";

@Injectable()
export class SMSService {
  private client: SNSClient;

  constructor() {
    this.client = new SNSClient({
      region: GLOBAL_CONFIG.aws.region,
      credentials: { accessKeyId: GLOBAL_CONFIG.aws.aws_access_key_id, secretAccessKey: GLOBAL_CONFIG.aws.aws_secret_access_key }
    });
  }

  async sendSMS(phoneNumber, message) {
    const params = {
      PhoneNumber: phoneNumber,
      Message: message,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      }
    };

    const command = new PublishCommand(params);

    const data = await this.client.send(command);
    return data.MessageId;
  }
}
