import dotenv from 'dotenv';
import { MongoHelper } from '@infra/db/mongodb/helpers/mongoHelper';
import { schedule } from 'node-cron';
import env from './config/env';
import { makeConsumesAnalyzedResultUseCase } from './factories/consumesAnalyzedResult';

dotenv.config();

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`));

    const cronJobLoopTimeExpression = '*/5 * * * * *';
    schedule(cronJobLoopTimeExpression, async () => {
      await makeConsumesAnalyzedResultUseCase().execute();
    });
  })
  .catch(console.error);
