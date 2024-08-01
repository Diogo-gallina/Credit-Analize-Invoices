import { FindAnalyzedResultUseCase } from '@app/use-cases/findAnalyzedResult/findAnalyzedResult';
import { badRequest, ok } from '@presentation/helper/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';

export class InvoiceResultController implements Controller {
  constructor(private readonly findAnalyzedResultUseCase: FindAnalyzedResultUseCase) {
    this.findAnalyzedResultUseCase = findAnalyzedResultUseCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { analyzedResultId } = httpRequest.params;
    const { email } = httpRequest.user;

    try {
      const analyzedResult = await this.findAnalyzedResultUseCase.execute(analyzedResultId, email);
      return ok(analyzedResult);
    } catch (error) {
      return badRequest(error);
    }
  }
}
