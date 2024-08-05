import { UnauthorizedError } from '@app/errors/unauthorizedError';
import { IAnalyzedResultRepository } from '@data/protocols/analyzedRepository';
import { IUserRepository } from '@data/protocols/userRepository';
import { AnalyzedResultModel } from '@domain/models/analyzedResult';

export class FindAnalyzedResultUseCase {
  constructor(
    public readonly analyzedResultRepository: IAnalyzedResultRepository,
    public readonly userRepository: IUserRepository,
  ) {
    this.analyzedResultRepository = analyzedResultRepository;
    this.userRepository = userRepository;
  }
  async execute(analyzedResultId: string, userEmail: string): Promise<AnalyzedResultModel> {
    const analyzedResult = await this.analyzedResultRepository.findOneById(analyzedResultId);
    const user = await this.userRepository.findOneByEmail(userEmail);

    if (analyzedResult.userId !== user.id) {
      throw new UnauthorizedError();
    }

    return analyzedResult;
  }
}
