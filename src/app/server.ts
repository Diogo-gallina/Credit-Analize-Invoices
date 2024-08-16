import dotenv from 'dotenv';
import { MongoHelper } from '@infra/db/mongodb/helpers/mongoHelper';
import { sqsHelper } from '@infra/cloud/lib/aws/helpers/messaging/sqsHelper';
import env from './config/env';
import { makeConsumesAnalyzedResultUseCase } from './factories/consumesAnalyzedResult';

dotenv.config();

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`));

    sqsHelper.consumesMessage('invoice-validation-result.fifo');
  })
  .catch(console.error);
