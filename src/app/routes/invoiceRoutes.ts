import { routeAdapter } from '@app/adapters/expressRoutesAdapter';
import { makeInvoiceController } from '@app/factories/addInvoice';
import { makeInvoiceHistoryController } from '@app/factories/invoiceHistory';
import { makeInvoiceResultController } from '@app/factories/invoiceResult';
import { upload } from '@app/middlewares';
import { authenticateJWT } from '@app/middlewares/authenticate';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/analyze-invoice', authenticateJWT, upload.single('invoiceFile'), routeAdapter(makeInvoiceController()));
  router.get('/analyze-history', authenticateJWT, routeAdapter(makeInvoiceHistoryController()));
  router.get('/analyze-result', authenticateJWT, routeAdapter(makeInvoiceResultController()));
};
