import fs from 'fs';
import path from 'path';
import { IInvoiceRepository } from '@data/protocols/invoiceRepository';
import { IUserRepository } from '@data/protocols/userRepository';
import { DbAddAnalizedResult } from '@data/use-cases/add-analyze-result/dbAddAnalyzeResult';
import { IEmailAdapter } from '@infra/sender-email/adapters/protocols/emailAdapterInterface';
import { IMessagingAdapter } from '@infra/cloud/adapters/protocols/messagingAdapterInterface';
import { QUEUES } from '@app/utils/constants';

export class ConsumesAnalyzedResultsUseCase {
  constructor(
    private readonly messagingAdapter: IMessagingAdapter,
    public readonly dbAddAnalyzedResult: DbAddAnalizedResult,
    public readonly userRepository: IUserRepository,
    public readonly invoiceRespository: IInvoiceRepository,
    public readonly emailAdapter: IEmailAdapter,
  ) {
    this.messagingAdapter = messagingAdapter;
    this.dbAddAnalyzedResult = dbAddAnalyzedResult;
    this.userRepository = userRepository;
    this.invoiceRespository = invoiceRespository;
    this.emailAdapter = emailAdapter;
  }

  async execute(): Promise<void> {
    const analyzedResults = await this.messagingAdapter.consumesAnalysisResult(QUEUES.INVOICE_VALIDATION_RESULT);

    for (const analyzedResult of analyzedResults) {
      try {
        const { userId, invoiceId, invoiveWasApproved } = analyzedResult;
        console.log('chamou');
        await this.dbAddAnalyzedResult.add({ userId, invoiceId, invoiveWasApproved, createdAt: new Date() });
        const user = await this.userRepository.findOneById(userId);
        const invoice = await this.invoiceRespository.findOneById(invoiceId);

        const subject = 'Invoice Analysis Result has been completed';
        const emailTemplatePath = path.resolve(__dirname, '../../utils/analyzedResultEmailTemplate.html');
        let emailHtml = fs.readFileSync(emailTemplatePath, 'utf8');

        emailHtml = emailHtml
          .replace('{{userName}}', user.name)
          .replace('{{invoiceId}}', invoice.id)
          .replace('{{issuerName}}', invoice.issuerName)
          .replace('{{document}}', invoice.document)
          .replace('{{paymentDate}}', new Date(invoice.paymentDate).toLocaleDateString())
          .replace('{{paymentAmount}}', invoice.paymentAmount.toFixed(2))
          .replace('{{statusClass}}', invoiveWasApproved ? 'approved' : 'rejected')
          .replace('{{statusText}}', invoiveWasApproved ? 'APPROVED' : 'REJECTED');

        await this.emailAdapter.sendEmail(user.email, subject, emailHtml);
      } catch (error) {
        console.error(`Error processing analyzed result: ${error.message}`);
      }
    }
  }
}
