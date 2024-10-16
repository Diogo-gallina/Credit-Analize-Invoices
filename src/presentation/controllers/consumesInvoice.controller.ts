import { ConsumesAnalyzedResultsUseCase } from '@app/use-cases/consumesAnalyzedResults/consumesAnalyzedResults';
import { internalServerError, ok } from '@presentation/helper/httpHelper';
import { Controller, HttpResponse } from '@presentation/protocols';

export class ConsumesInvoiceController implements Controller {
  constructor(private readonly consumesAnalyzedResultsUseCase: ConsumesAnalyzedResultsUseCase) {
    this.consumesAnalyzedResultsUseCase = consumesAnalyzedResultsUseCase;
  }

  async handle(): Promise<HttpResponse> {
    try {
      await this.consumesAnalyzedResultsUseCase.execute();
      return ok({ message: 'OK' });
    } catch (error) {
      return internalServerError(error.message);
    }
  }
}
