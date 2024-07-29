import { routeAdapter } from '@app/adapters/expressRoutesAdapter';
import { makeInvoiceController } from '@app/factories/addInvoice';
import { upload } from '@app/middlewares';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/analyze-invoice', upload.single('invoiceFile'), routeAdapter(makeInvoiceController()));
};
