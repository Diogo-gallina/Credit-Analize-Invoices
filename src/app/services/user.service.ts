import { decode } from 'jsonwebtoken';

export class UserService {
  static getEmailFromToken(token: string): string | null {
    const decodedToken: any = decode(token);
    if (decodedToken && decodedToken.email) return decodedToken.email;
    return null;
  }
}
