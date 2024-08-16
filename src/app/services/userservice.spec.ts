import { decode } from 'jsonwebtoken';
import { UserService } from './user.service';

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn(),
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return email when token is valid and contains email', () => {
    const token = 'valid_token';
    const expectedEmail = 'test@example.com';
    (decode as jest.Mock).mockReturnValue({ email: expectedEmail });

    const email = UserService.getEmailFromToken(token);

    expect(email).toBe(expectedEmail);
  });
});
