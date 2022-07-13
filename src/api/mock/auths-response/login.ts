import { LoginResponse } from 'api/auths-api/login';

export const mockLoginResponse: LoginResponse = {
  access_token: 'xxx',
  refresh_token: 'xxx',
  user: {
    userId: 1,
    email: 'user@example.com',
    nickname: 'Axel',
  },
};
