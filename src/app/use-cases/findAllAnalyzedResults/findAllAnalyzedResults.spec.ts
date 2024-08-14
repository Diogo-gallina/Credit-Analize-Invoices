/* eslint-disable max-classes-per-file */
import { IAnalyzedResultRepository } from '@data/protocols/analyzedRepository';
import { IUserRepository } from '@data/protocols/userRepository';
import { UserModel } from '@domain/models/user';
import { AddUserModel } from '@domain/use-cases/addUser';
import { AnalyzedResultModel } from '@domain/models/analyzedResult';
import { AddAnalyzedResultModel } from '@domain/use-cases/addAnalyzedResult';
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
    userId: 'any_user_id_2',
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
  it('should call analyzedResultRepository findAll method', async () => {
    const { sut, analyzedResultRepositoryStub } = makeSut();
    const findAllSpy = jest.spyOn(analyzedResultRepositoryStub, 'findAll');
    const userEmail = 'any_email';
    await sut.execute(userEmail);
    expect(findAllSpy).toHaveBeenCalledTimes(1);
  });
});
