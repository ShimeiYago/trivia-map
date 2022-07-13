import { ApiError } from 'api/utils/handle-axios-error';
import { login } from '../login';

describe('login', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await login('user@example.com', 'password');
    expect(response.user.userId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(login('user@example.com', 'password')).rejects.toEqual(
      expectedApiError,
    );
  });
});
