import { ApiError } from 'api/utils/handle-axios-error';
import { changePassword } from '../change-password';
import { deactivate } from '../deactivate';
import { getUserInfo } from '../get-user-info';
import { login } from '../login';
import { logout } from '../logout';
import { refreshToken } from '../refresh-token';
import { registration } from '../registration';
import { resendEmail } from '../resend-email';
import { resetPassword } from '../reset-password';
import { resetPasswordConfirm } from '../reset-password-confirm';
import { twitterAccessToken } from '../twitter-access-token';
import { twitterLogin } from '../twitter-login';
import { twitterRequestToken } from '../twitter-request-token';
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
    await expect(login('user@example.com', 'password')).rejects.toEqual(expectedApiError);
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

    const response = await registration({
      email: 'user@example.com',
      nickname: 'Axel',
      password1: 'password1',
      password2: 'password2',
    });
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
      registration({
        email: 'user@example.com',
        nickname: 'Axel',
        password1: 'password1',
        password2: 'password2',
      }),
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
    await expect(resetPassword('user@example.com')).rejects.toEqual(expectedApiError);
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

    const response = await updateUserInfo({
      nickname: 'Axel',
      icon: {
        dataUrl: 'data:image/png;base64,xxx',
        fileName: 'filename',
      },
    });
    expect(response.userId).toBe(1);
  });

  it('handle null icon', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await updateUserInfo({
      nickname: 'Axel',
      icon: null,
    });
    expect(response.userId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(updateUserInfo({ nickname: 'Axel' })).rejects.toEqual(expectedApiError);
  });
});

describe('changePassword', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await changePassword('password1', 'password2');
    expect(response).toEqual(undefined);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(changePassword('password1', 'password2')).rejects.toEqual(expectedApiError);
  });
});

describe('resetPasswordConfirm', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await resetPasswordConfirm({
      password1: 'password1',
      password2: 'password2',
      uid: 'uid',
      token: 'token',
    });
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
      resetPasswordConfirm({
        password1: 'password1',
        password2: 'password2',
        uid: 'uid',
        token: 'token',
      }),
    ).rejects.toEqual(expectedApiError);
  });
});

describe('logout', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await logout();
    expect(response).toEqual(undefined);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(logout()).rejects.toEqual(expectedApiError);
  });
});

describe('twitterRequestToken', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await twitterRequestToken({ callbackUrl: 'https://xxx' });
    expect(response.authenticateUrl).toBe(
      'https://api.twitter.com/oauth/authenticate?oauth_token=xxx',
    );
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(twitterRequestToken({ callbackUrl: 'https://xxx' })).rejects.toEqual(
      expectedApiError,
    );
  });
});

describe('twitterAccessToken', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await twitterAccessToken({
      oauthToken: 'xxx',
      oauthVerifier: 'xxx',
    });
    expect(response.accessToken).toBe('xxx');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(
      twitterAccessToken({
        oauthToken: 'xxx',
        oauthVerifier: 'xxx',
      }),
    ).rejects.toEqual(expectedApiError);
  });
});

describe('twitterLogin', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await twitterLogin({ accessToken: 'xxx', accessTokenSecret: 'xxx' });
    expect(response.user.userId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(twitterLogin({ accessToken: 'xxx', accessTokenSecret: 'xxx' })).rejects.toEqual(
      expectedApiError,
    );
  });
});

describe('deactivate', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await deactivate();
    expect(response).toEqual(undefined);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(deactivate()).rejects.toEqual(expectedApiError);
  });
});
