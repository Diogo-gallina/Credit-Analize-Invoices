/* eslint-disable prefer-object-spread */
import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null as unknown as MongoClient;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.uri);
    return this.client.db().collection(name);
  },

  map: (document: any): any => {
    if (!document) return null;
    const { _id, ...documentWithoutId } = document;
    if (!_id) throw new Error('Document is missing _id');
    return {
      ...documentWithoutId,
      id: _id.toHexString(),
    };
  },
};
