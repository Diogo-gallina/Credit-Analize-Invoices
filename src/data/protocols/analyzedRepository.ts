import { AnalyzedResultModel } from '@domain/models/analyzedResult';
import { AddAnalyzedResultModel } from '@domain/use-cases/addAnalyzedResult';

export interface IAnalyzedResultRepository {
  add(analyzedResultData: AddAnalyzedResultModel): Promise<AnalyzedResultModel>;
  findOneById(analyzedResultId: string): Promise<AnalyzedResultModel>;
  findAll(): Promise<AnalyzedResultModel[]>;
}
