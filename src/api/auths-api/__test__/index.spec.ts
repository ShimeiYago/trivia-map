import { ApiError } from 'api/utils/handle-axios-error';
import { getUserInfo } from '../get-user-info';
import { login } from '../login';
import { refreshToken } from '../refresh-token';
import { registration } from '../registration';
import { resendEmail } from '../resend-email';
import { resetPassword } from '../reset-password';
import { updateUserInfo } from '../update-user-info';
import { verifyEmail } from '../verify-email';

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

describe('registration', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await registration(
      'user@example.com',
      'Axel',
      'password1',
      'password2',
    );
    expect(response).toEqual(undefined);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(
      registration('user@example.com', 'Axel', 'password1', 'password2'),
    ).rejects.toEqual(expectedApiError);
  });
});

describe('reset-password', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await resetPassword('user@example.com');
    expect(response).toEqual(undefined);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(resetPassword('user@example.com')).rejects.toEqual(
      expectedApiError,
    );
  });
});

describe('verify-email', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await verifyEmail('xxxxxx');
    expect(response).toEqual(undefined);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(verifyEmail('xxxxxx')).rejects.toEqual(expectedApiError);
  });
});

describe('resend-email', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await resendEmail('xxxxxx');
    expect(response).toEqual(undefined);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(resendEmail('xxxxxx')).rejects.toEqual(expectedApiError);
  });
});

describe('getUserInfo', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getUserInfo();
    expect(response.userId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getUserInfo()).rejects.toEqual(expectedApiError);
  });
});

describe('refreshToken', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await refreshToken();
    expect(response.access).toBe('xxx');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(refreshToken()).rejects.toEqual(expectedApiError);
  });
});

describe('update-user-info', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await updateUserInfo('Axel');
    expect(response.userId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(updateUserInfo('Axel')).rejects.toEqual(expectedApiError);
  });
});
