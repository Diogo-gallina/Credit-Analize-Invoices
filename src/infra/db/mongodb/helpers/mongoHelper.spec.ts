import env from '@app/config/env';
import { MongoHelper as sut } from './mongoHelper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(env.mongoUrl);
  });

  beforeAll(async () => {
    await sut.disconnect();
  });

  it('Should reconnect if mongo is down', async () => {
    let accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});
