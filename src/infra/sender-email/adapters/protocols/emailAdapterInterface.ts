export interface IEmailAdapter {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}
