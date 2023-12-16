import path from "path";

import { Injectable } from "@nestjs/common";
import nodemailer, { Transporter } from "nodemailer";
import Email from "email-templates";

import { GLOBAL_CONFIG } from "configs/global.config";

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(GLOBAL_CONFIG.email.server);
  }

  sendEmail(to: string, template: {subject: string, templateName: string}, data: unknown) {
    const { subject, templateName } = template;
    return new Promise((resolve, reject) => {
      const email = new Email({
        views: {
          options: {
            extension: "ejs",
          },
        },
      });
      const emailDir = path.resolve(
        __dirname,
        "./templates",
        `${templateName}`,
      );

      email.render(path.join(emailDir), { data }).then((html) => {
        const mailOptions = {
          from: GLOBAL_CONFIG.email.from_email,
          to,
          subject,
          text: html,
          html: html,
        };
        this.transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });
    });
  }
}
