/* eslint-disable max-classes-per-file */
import { IAnalyzedResultRepository } from '@data/protocols/analyzedRepository';
import { IUserRepository } from '@data/protocols/userRepository';
import { UserModel } from '@domain/models/user';
import { AddUserModel } from '@domain/use-cases/addUser';
import { AnalyzedResultModel } from '@domain/models/analyzedResult';
import { AddAnalyzedResultModel } from '@domain/use-cases/addAnalyzedResult';
import { NotFoundError } from '@app/errors/notFound';
import { FindAllAnalyzedResultsUseCase } from './findAllAnalyzedResults';

interface SutTypes {
  sut: FindAllAnalyzedResultsUseCase;
  userRepositoryStub: IUserRepository;
  analyzedResultRepositoryStub: IAnalyzedResultRepository;
}

const makeFakeUser = (): UserModel => ({
  id: 'any_user_id',
  name: 'any_name',
  document: 'any_document',
  email: 'any_email',
  createdAt: new Date('2024-03-10'),
});

const makeFakeAnalyzedResult = (): AnalyzedResultModel => ({
  id: 'any_analyzed_id',
  userId: 'any_user_id',
  invoiceId: 'any_invoice_id',
  invoiveWasApproved: true,
  createdAt: new Date('2024-03-11'),
});

const makeFakeArrayAnalyzedResult = (): AnalyzedResultModel[] => [
  makeFakeAnalyzedResult(),
  {
    id: 'any_analyzed_id_2',
    userId: 'any_user_id',
    invoiceId: 'any_invoice_id_2',
    invoiveWasApproved: false,
    createdAt: new Date('2024-04-11'),
  },

  {
    id: 'any_analyzed_id_2',
    userId: 'any_user_id',
    invoiceId: 'any_invoice_id_2',
    invoiveWasApproved: false,
    createdAt: new Date('2024-04-11'),
  },
];

const makeUserRepository = (): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    async add(userData: AddUserModel): Promise<UserModel> {
      return Promise.resolve(makeFakeUser());
    }
    async findOneByEmail(email: string): Promise<UserModel> {
      return Promise.resolve(makeFakeUser());
    }
    async findOneById(userId: string): Promise<UserModel> {
      return Promise.resolve(makeFakeUser());
    }
  }
  return new UserRepositoryStub();
};

const makeAnalyzedResultRepository = (): IAnalyzedResultRepository => {
  class AnalyzedResultRepositoryStub implements IAnalyzedResultRepository {
    add(analyzedResultData: AddAnalyzedResultModel): Promise<AnalyzedResultModel> {
      return Promise.resolve(makeFakeAnalyzedResult());
    }
    findOneById(analyzedResultId: string): Promise<AnalyzedResultModel> {
      return Promise.resolve(makeFakeAnalyzedResult());
    }
    findAll(): Promise<AnalyzedResultModel[]> {
      return Promise.resolve(makeFakeArrayAnalyzedResult());
    }
  }
  return new AnalyzedResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const userRepositoryStub = makeUserRepository();
  const analyzedResultRepositoryStub = makeAnalyzedResultRepository();
  const sut = new FindAllAnalyzedResultsUseCase(analyzedResultRepositoryStub, userRepositoryStub);
  return {
    sut,
    userRepositoryStub,
    analyzedResultRepositoryStub,
  };
};

describe('Find AllAnalyzed Results Use Case', () => {
  it('should be defined', () => {
    const { sut, analyzedResultRepositoryStub, userRepositoryStub } = makeSut();
    expect(sut).toBeInstanceOf(FindAllAnalyzedResultsUseCase);
    expect(analyzedResultRepositoryStub).toBeDefined();
    expect(userRepositoryStub).toBeDefined();
  });

  it('should call analyzedResultRepository findAll method', async () => {
    const { sut, analyzedResultRepositoryStub } = makeSut();
    const findAllSpy = jest.spyOn(analyzedResultRepositoryStub, 'findAll');
    const userEmail = 'any_email';
    await sut.execute(userEmail);
    expect(findAllSpy).toHaveBeenCalledTimes(1);
  });

  it('should call userRepository findOneByEmail with correct params', async () => {
    const { sut, userRepositoryStub } = makeSut();
    const findOneByEmailSpy = jest.spyOn(userRepositoryStub, 'findOneByEmail');
    const userEmail = 'any_email';
    await sut.execute(userEmail);
    expect(findOneByEmailSpy).toHaveBeenCalledTimes(1);
    expect(findOneByEmailSpy).toHaveBeenCalledWith(userEmail);
  });

  it('should throws NotFoundError if analyzedResults length to equal 0', async () => {
    const { sut, analyzedResultRepositoryStub } = makeSut();
    jest.spyOn(analyzedResultRepositoryStub, 'findAll').mockResolvedValue([]);
    const userEmail = 'any_email';
    await expect(sut.execute(userEmail)).rejects.toBeInstanceOf(NotFoundError);
    await expect(sut.execute(userEmail)).rejects.toThrow('Dont found results');
  });

  it('should throws NotFoundError if analyzedResults alloweds to user have length to equal 0', async () => {
    const { sut, analyzedResultRepositoryStub } = makeSut();
    const analyzedResultsAlloweds = makeFakeArrayAnalyzedResult();
    analyzedResultsAlloweds[0].userId = 'denied_user_id';
    analyzedResultsAlloweds[1].userId = 'denied_user_id';
    analyzedResultsAlloweds[2].userId = 'denied_user_id';
    jest.spyOn(analyzedResultRepositoryStub, 'findAll').mockResolvedValue(analyzedResultsAlloweds);
    const userEmail = 'any_email';
    await expect(sut.execute(userEmail)).rejects.toBeInstanceOf(NotFoundError);
    await expect(sut.execute(userEmail)).rejects.toThrow('Dont found results');
  });

  it('should return a list of analyzedResults for allowed the user', async () => {
    const { sut, analyzedResultRepositoryStub } = makeSut();
    const analyzedResultsAlloweds = makeFakeArrayAnalyzedResult();
    analyzedResultsAlloweds[1].userId = 'denied_user_id';
    jest.spyOn(analyzedResultRepositoryStub, 'findAll').mockResolvedValue(analyzedResultsAlloweds);
    const userEmail = 'any_email';
    const analyzedResults = await sut.execute(userEmail);
    expect(analyzedResults).toEqual([analyzedResultsAlloweds[0], analyzedResultsAlloweds[2]]);
  });
});
