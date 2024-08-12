/* eslint-disable consistent-return */
import { AuthenticatedRequest } from '@infra/framework-requester/adapters/expressRoutesAdapter';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const COGNITO_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA/GeS6518p94XLVJT238F
OPDbaWAYL9PacOY5DeBHoe4499RZPVinMhSsQAQJcCz2kxYAPZ43vCt50Outzesa
O6zflCccKazJN2BwWLs2Dvj09nGy6F5yQGo5SL89qozsQ4QQrQSWB65T8VBIAWYp
38qcezb5vaQstxwIb64kDbZY+oVOiym2eS4NSPxg6w2Xa45RkMUgDAMMtH9GaP//
W/D4HR//PH6arNjAvJsfb7NiTlp7dVhpjYLSMySswQr20U7FGRUlIV4rWjLNAQth
fNhCBGt4lHT0jgv4vtPaRiTNPZ4wjrCQSPTMafEk5l6mJ783ypPDMeI6CsFho3el
wwIDAQAB
-----END PUBLIC KEY-----`;

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response<any> | void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, COGNITO_PUBLIC_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};
