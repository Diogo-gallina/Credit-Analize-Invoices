import nodemailer from 'nodemailer';
import { IEmailHelper } from '../../../protocols/emailHelperInterface';

const SENDER_EMAIL = 'credit.analyze20@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: 'imkwvirasfoapasj',
  },
});

export const nodemailerHelper: IEmailHelper = {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    return new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: SENDER_EMAIL,
          to,
          subject,
          html: body,
        },
        (error) => {
          if (error) reject(error);
          resolve();
        },
      );
    });
  },
};
