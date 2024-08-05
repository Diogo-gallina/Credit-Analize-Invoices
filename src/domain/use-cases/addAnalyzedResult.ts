import { AnalyzedResultModel } from '@domain/models/analyzedResult';

export class AddAnalyzedResultModel {
  userId: string;
  invoiceId: string;
  invoiveWasApproved: boolean;
  createdAt: Date;
}

export interface AddAnalyzedResult {
  add(analyzedResultData: AddAnalyzedResultModel): Promise<AnalyzedResultModel>;
}
