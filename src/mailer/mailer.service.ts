import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import Mailjet from 'node-mailjet';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  private readonly mailjet: Mailjet
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.mailjet = new Mailjet({
      apiKey: configService.get('mail.apiKey', { infer: true }),
      apiSecret: configService.get('mail.secretKey', { infer: true })
    })
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.promises.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    const request = this.mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "noreply@digifranchise.co.za",
              Name: "No Reply"
            },
            To: [
              {
                Email: mailOptions.to,
                Name: "passenger 1"
              }
            ],
            Subject: mailOptions.subject,
            TextPart: "Hi",
            HTMLPart: html
          }
        ]
      })

      try {
        await request;
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
      }
  }
}
