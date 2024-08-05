import { DbAddAnalizedResult } from '@data/use-cases/add-analyze-result/dbAddAnalyzeResult';
import { IMessagingAdapter } from '@infra/cloud/adapters/protocols/messagingAdapterInterface';

const CONSUME_QUEUE_NAME = 'invoice-validation-result.fifo';

export class ConsumesAnalyzedResultsUseCase {
  constructor(
    private readonly messagingAdapter: IMessagingAdapter,
    public readonly dbAddAnalyzedResult: DbAddAnalizedResult,
  ) {
    this.messagingAdapter = messagingAdapter;
    this.dbAddAnalyzedResult = dbAddAnalyzedResult;
  }

  async execute(): Promise<void> {
    const analyzedResults = await this.messagingAdapter.consumesAnalysisResult(CONSUME_QUEUE_NAME);

    for (const analyzedResult of analyzedResults) {
      try {
        const { userId, invoiceId, invoiveWasApproved } = analyzedResult;
        await this.dbAddAnalyzedResult.add({ userId, invoiceId, invoiveWasApproved, createdAt: new Date() });
      } catch (error) {
        console.error(`Error processing analyzed result: ${error.message}`);
      }
    }
  }
}
