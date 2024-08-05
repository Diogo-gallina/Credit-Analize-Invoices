import { AddAnalyzedResult, AddAnalyzedResultModel } from '@domain/use-cases/addAnalyzedResult';
import { AnalyzedResultModel } from '@domain/models/analyzedResult';
import { IAnalyzedResultRepository } from '@data/protocols/analyzedRepository';

export class DbAddAnalizedResult implements AddAnalyzedResult {
  constructor(private readonly analyzedResultRepository: IAnalyzedResultRepository) {
    this.analyzedResultRepository = analyzedResultRepository;
  }

  async add(analyzedResultData: AddAnalyzedResultModel): Promise<AnalyzedResultModel> {
    const analyzedResult = await this.analyzedResultRepository.add(analyzedResultData);
    return new Promise<AnalyzedResultModel>((resolve) => resolve(analyzedResult));
  }
}
