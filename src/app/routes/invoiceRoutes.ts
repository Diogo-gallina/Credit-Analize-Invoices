import { makeInvoiceController } from '@app/factories/addInvoice';
import { makeInvoiceHistoryController } from '@app/factories/invoiceHistory';
import { upload } from '@app/middlewares';
import { authenticateJWT } from '@app/middlewares/authenticate';
import { routeAdapter } from '@infra/web-framework/adapters/expressRoutesAdapter';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/analyze-invoice', authenticateJWT, upload.single('invoiceFile'), routeAdapter(makeInvoiceController()));
  router.get('/analyze-history', authenticateJWT, routeAdapter(makeInvoiceHistoryController()));
};
