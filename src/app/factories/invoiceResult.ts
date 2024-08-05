import { FindAnalyzedResultUseCase } from '@app/use-cases/findAnalyzedResult/findAnalyzedResult';
import { AnalyzedResultMongoRepository } from '@infra/db/mongodb/analyzed-result-repository/anlyzedResult';
import { UserMongoRepository } from '@infra/db/mongodb/user-repository/user';
import { InvoiceResultController } from '@presentation/controllers/invoiceResult.controller';
import { Controller } from '@presentation/protocols';

export const makeInvoiceResultController = (): Controller => {
  const analyzedResultRepository = new AnalyzedResultMongoRepository();
  const userRepository = new UserMongoRepository();
  const findAnalyzedResultUseCase = new FindAnalyzedResultUseCase(analyzedResultRepository, userRepository);
  return new InvoiceResultController(findAnalyzedResultUseCase);
};
