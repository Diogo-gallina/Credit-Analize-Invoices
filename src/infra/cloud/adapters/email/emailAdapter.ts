import { IEmailHelper } from '@infra/cloud/lib/protocols/emailHelperInterface';
import { IEmailAdapter } from '../protocols/emailAdapterInterface';

export class EmailAdapter implements IEmailAdapter {
  constructor(private readonly emailHelper: IEmailHelper) {
    this.emailHelper = emailHelper;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this.emailHelper.sendEmail(to, subject, body);
  }
}
