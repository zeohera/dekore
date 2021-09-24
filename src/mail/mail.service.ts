import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendUserActiveLink(emailTo, link): Promise<void> {
    await this.mailerService.sendMail({
      to: emailTo,
      subject: 'active Account',
      html: `<a href = "${link}">Link<a>`,
    });
  }
  async sendSecretCode(emailTo, secretCode): Promise<void> {
    await this.mailerService.sendMail({
      to: emailTo,
      subject: 'secretCode',
      text: secretCode.toString(),
    });
  }
}
