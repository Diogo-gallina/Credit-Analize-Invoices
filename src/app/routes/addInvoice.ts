import { adaptRoute } from 'app/adapters/expressRoutesAdapter';
import { makeAddInvoiceController } from 'app/factories/addInvoice';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/analyze-invoice', adaptRoute(makeAddInvoiceController()));
};
