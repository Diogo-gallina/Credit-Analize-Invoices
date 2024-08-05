import { ConsumesAnalyzedResultsUseCase } from '@app/use-cases/consumesAnalyzedResults/consumesAnalyzedResults';
import { DbAddAnalizedResult } from '@data/use-cases/add-analyze-result/dbAddAnalyzeResult';
import { MessagingAdapter } from '@infra/cloud/adapters/messaging/messagingAdapter';
import { sqsHelper } from '@infra/cloud/aws/helpers/messaging/sqsHelper';
import { AnalyzedResultMongoRepository } from '@infra/db/mongodb/analyzed-result-repository/anlyzedResult';

export const makeConsumesAnalyzedResultUseCase = (): ConsumesAnalyzedResultsUseCase => {
  const messagingAdapter = new MessagingAdapter(sqsHelper);
  const analyzedResultRepository = new AnalyzedResultMongoRepository();
  const dbAddAnalyzedResult = new DbAddAnalizedResult(analyzedResultRepository);
  return new ConsumesAnalyzedResultsUseCase(messagingAdapter, dbAddAnalyzedResult);
};
