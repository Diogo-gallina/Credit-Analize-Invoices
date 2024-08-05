import { FindAllAnalyzedResultsUseCase } from '@app/use-cases/findAllAnalyzedResults/findAllAnalyzedResults';
import { internalServerError, ok } from '@presentation/helper/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';

export class InvoiceHistoryController implements Controller {
  constructor(private readonly findAllAnalyzedResultsUseCase: FindAllAnalyzedResultsUseCase) {
    this.findAllAnalyzedResultsUseCase = findAllAnalyzedResultsUseCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.user;

    try {
      const results = await this.findAllAnalyzedResultsUseCase.execute(email);
      return ok(results);
    } catch (error) {
      console.error(error);
      return internalServerError(error.message);
    }
  }
}
