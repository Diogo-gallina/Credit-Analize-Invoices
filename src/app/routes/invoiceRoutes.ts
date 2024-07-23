import { routeAdapter } from '@app/adapters/expressRoutesAdapter';
import { makeInvoiceController } from '@app/factories/addInvoice';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/analyze-invoice', routeAdapter(makeInvoiceController()));
};
