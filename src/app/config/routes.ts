import { Express, Router } from 'express';
import fastGlob from 'fast-glob';

export default (app: Express): void => {
  const router = Router();
  app.use('/creadit-analyze', router);
  fastGlob.sync('**/src/main/routes/**routes.ts').map(async (file) => {
    const route = (await import(`../../../${file}`)).default;
    route(router);
  });
};
