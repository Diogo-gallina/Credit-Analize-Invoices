import { NotFoundError } from '@app/errors/notFound';
import { IAnalyzedResultRepository } from '@data/protocols/analyzedRepository';
import { IUserRepository } from '@data/protocols/userRepository';
import { AnalyzedResultModel } from '@domain/models/analyzedResult';

export class FindAllAnalyzedResultsUseCase {
  constructor(
    public readonly analyzedResultRepository: IAnalyzedResultRepository,
    public readonly userRepository: IUserRepository,
  ) {
    this.analyzedResultRepository = analyzedResultRepository;
    this.userRepository = userRepository;
  }

  async execute(userEmail: string): Promise<AnalyzedResultModel[]> {
    const analyzedResults = await this.analyzedResultRepository.findAll();
    const user = await this.userRepository.findOneByEmail(userEmail);
    const analyzedResultsAlloweds: AnalyzedResultModel[] = [];

    console.log('USER: ', { user });

    analyzedResults.forEach((analyzedResult) => {
      if (analyzedResult.userId === user.id) analyzedResultsAlloweds.push(analyzedResult);
    });

    console.log(analyzedResultsAlloweds.length);
    if (analyzedResultsAlloweds.length === 0) throw new NotFoundError('Dont found results');

    return analyzedResultsAlloweds;
  }
}
