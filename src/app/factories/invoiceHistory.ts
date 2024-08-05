import { FindAllAnalyzedResultsUseCase } from '@app/use-cases/findAllAnalyzedResults/findAllAnalyzedResults';
import { AnalyzedResultMongoRepository } from '@infra/db/mongodb/analyzed-result-repository/anlyzedResult';
import { UserMongoRepository } from '@infra/db/mongodb/user-repository/user';
import { InvoiceHistoryController } from '@presentation/controllers/invoiceHistory.controller';
import { Controller } from '@presentation/protocols';

export const makeInvoiceHistoryController = (): Controller => {
  const analyzedResultRepository = new AnalyzedResultMongoRepository();
  const userRepository = new UserMongoRepository();
  const findAllAnalyzedResultsUseCase = new FindAllAnalyzedResultsUseCase(analyzedResultRepository, userRepository);
  return new InvoiceHistoryController(findAllAnalyzedResultsUseCase);
};
