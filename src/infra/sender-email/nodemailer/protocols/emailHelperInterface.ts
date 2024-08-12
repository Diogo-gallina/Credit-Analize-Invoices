export interface IEmailHelper {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}
