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

  it('should return null when token does not contain email', () => {
    const token = 'token_without_email';
    (decode as jest.Mock).mockReturnValue({});

    const email = UserService.getEmailFromToken(token);

    expect(email).toBeNull();
  });

  it('should return null when token is invalid or cannot be decoded', () => {
    const token = 'invalid_token';
    (decode as jest.Mock).mockReturnValue(null);

    const email = UserService.getEmailFromToken(token);

    expect(email).toBeNull();
  });
});
