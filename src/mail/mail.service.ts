import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { I18nContext } from "nestjs-i18n";
import { MailData, OrderStatusUpdateMailData } from "./interfaces/mail-data.interface";
import { AllConfigType } from "src/config/config.type";
import { MaybeType } from "../utils/types/maybe.type";
import { MailerService } from "../mailer/mailer.service";
import path from "path";
import { ForgotPasswordForWebsMailData } from "./interfaces/forgot-password-for-webs-mail-data.interface";

interface EnquiryEmailBody {
  from: string;
  phone: string;
  message: string;
  names: string;
}
@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t("common.confirmEmail"),
        i18n.t("confirm-email.text1"),
        i18n.t("confirm-email.text2"),
        i18n.t("confirm-email.text3"),
      ]);
    }

    const url = new URL(process.env.FRONTEND_DOMAIN + "/confirm-email");
    url.searchParams.set("hash", mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow("app.workingDirectory", {
          infer: true,
        }),
        "src",
        "mail",
        "mail-templates",
        "activation.hbs"
      ),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get("app.name", { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }

  async customerSignUp(
    mailData: MailData<{ hash: string; websiteUrl?: string }>
  ): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t("common.confirmEmail"),
        i18n.t("confirm-email.text1"),
        i18n.t("confirm-email.text2"),
        i18n.t("confirm-email.text3"),
      ]);
    }
    const url = new URL(mailData.data.websiteUrl + "/confirm-email");
    url.searchParams.set("hash", mailData.data.hash);
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow("app.workingDirectory", {
          infer: true,
        }),
        "src",
        "mail",
        "mail-templates",
        "customer-activation.hbs"
      ),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get("app.name", { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }

  async forgotPassword(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    let text4: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3, text4] = await Promise.all([
        i18n.t("common.resetPassword"),
        i18n.t("reset-password.text1"),
        i18n.t("reset-password.text2"),
        i18n.t("reset-password.text3"),
        i18n.t("reset-password.text4"),
      ]);
    }

    const url = new URL(
      this.configService.getOrThrow("app.frontendDomain", {
        infer: true,
      }) + "/password-change"
    );
    url.searchParams.set("hash", mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${url.toString()} ${resetPasswordTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow("app.workingDirectory", {
          infer: true,
        }),
        "src",
        "mail",
        "mail-templates",
        "reset-password.hbs"
      ),
      context: {
        title: resetPasswordTitle,
        url: url.toString(),
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get("app.name", {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }

  async forgotPasswordForWebs(
    mailData: ForgotPasswordForWebsMailData
  ): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    let text4: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3, text4] = await Promise.all([
        i18n.t("common.resetPassword"),
        i18n.t("reset-password.text1"),
        i18n.t("reset-password.text2"),
        i18n.t("reset-password.text3"),
        i18n.t("reset-password.text4"),
      ]);
    }

    const url = new URL(mailData.data.websiteUrl + "/password-change");
    url.searchParams.set("hash", mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${url.toString()} ${resetPasswordTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow("app.workingDirectory", {
          infer: true,
        }),
        "src",
        "mail",
        "mail-templates",
        "reset-password.hbs"
      ),
      context: {
        title: resetPasswordTitle,
        url: url.toString(),
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get("app.name", {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }

  async sendEnquiryEmail(
    to: string,
    subject: string,
    body: EnquiryEmailBody,
    senderName: string,
    senderEmail: string
  ): Promise<void> {
    const i18n = I18nContext.current();
    let emailSubject: MaybeType<string>;
    let emailBody: MaybeType<string>;

    if (i18n) {
      emailSubject = await i18n.t("enquiry-email.subject");
      emailBody = await i18n.t("enquiry-email.body");
    }

    const templatePath = path.join(
      this.configService.getOrThrow("app.workingDirectory", {
        infer: true,
      }),
      "src",
      "mail",
      "mail-templates",
      "enquiry-email.hbs"
    );

    const context = {
      title: emailSubject || subject,
      from: senderEmail,
      fromName: senderName,
      phone: body.phone,
      message: body.message,
      names: body.names,
      app_name: this.configService.get("app.name", {
        infer: true,
      }),
    };

    await this.mailerService.sendMail({
      to,
      from: `${senderName} <${senderEmail}>`,
      subject: `${senderName}: ${emailSubject || subject}`,
      templatePath,
      context,
    });
  }

  async confirmOrderNumber(
    mailData: MailData<{ hash: string }>
  ): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t("common.createOrder"),
        i18n.t("confirm-order.text1"),
        i18n.t("confirm-order.text2"),
        i18n.t("confirm-order.text3"),
      ]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: ``,
      templatePath: path.join(
        this.configService.getOrThrow("app.workingDirectory", {
          infer: true,
        }),
        "src",
        "mail",
        "mail-templates",
        "activation.hbs"
      ),
      context: {
        title: emailConfirmTitle,
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get("app.name", { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }

  async sendMailToConfirmCreatedOrder(
    mailData: MailData<{
      orderNumber: string;
      email: string;
      items?: any;
    }>
  ): Promise<void> {
    const context = {
      orderNumber: mailData.data.orderNumber,
      app_name: this.configService.get("app.name", { infer: true }),
      items: mailData.data.items,
    };
    const subject = `${context.app_name} Order Confirmation - Order Code: ${context.orderNumber}`;

    await this.mailerService.sendMail({
      to: mailData.data.email,
      subject: subject,

      templatePath: path.join(
        this.configService.getOrThrow("app.workingDirectory", { infer: true }),
        "src",
        "mail",
        "mail-templates",
        "sendMail-toConfirm-CreatedOrder.hbs"
      ),
      context: context,
    });
  }
  async sendQuotationEmail(
    mailData: MailData<{
      quotationId: string;
      quotation: { [key: string]: any };
    }>
  ): Promise<void> {
    const context = {
      quotationNumber: mailData.data.quotationId,
      app_name: this.configService.get("app.name", { infer: true }),
    };

    const subject = `${context.app_name} Quotation Confirm- Qoutation Code: ${context.quotationNumber}`;

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: subject,

      templatePath: path.join(
        this.configService.getOrThrow("app.workingDirectory", { infer: true }),
        "src",
        "mail",
        "mail-templates",
        "quotation.hbs"
      ),
      context: context,
    });
  }

  async sendOrderStatusUpdateEmail(mailData: OrderStatusUpdateMailData): Promise<void> {
    const i18n = I18nContext.current();
    
    let emailSubject: string = ''; 
    let emailBody: string;
    
    if (i18n) {
      emailSubject = await i18n.t('orderStatusUpdate');
      emailBody = await i18n.t('orderStatusUpdate.body');
    }
    
    const context = {
      app_name: this.configService.get('app.name', { infer: true }),
      previousStatus: mailData.previousStatus,
      newStatus: mailData.newStatus,
      orderUrl: mailData.orderUrl,
      orderId: mailData.orderId,
    };
  
    try {
      await this.mailerService.sendMail({
        to: mailData.to,
        subject: emailSubject || 'Order Status Update',
        templatePath: path.join(
          this.configService.getOrThrow('app.workingDirectory', { infer: true }),
          'src',
          'mail',
          'mail-templates',
          'updateOrderStatus.hbs',
        ),
        context: context,
      });
      console.log(`Email sent to: ${mailData.to}`);
    } catch (error) {
      console.error(`Failed to send email to: ${mailData.to}`, error);
    }
  }
  
}
