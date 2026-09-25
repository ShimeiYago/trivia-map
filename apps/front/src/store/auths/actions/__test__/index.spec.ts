import { mockRefreshTokenResponse } from 'api/mock/auths-response/refresh-token';
import { mockGetUserInfoResponse } from './../../../../api/mock/auths-response/get-user-info';
import { COOKIE_NAME } from './../../../../constant/index';
import { autoLogin, logout } from '..';
import * as GetUserInfoModule from 'api/auths-api/get-user-info';
import * as RefreshTokenModule from 'api/auths-api/refresh-token';
import * as LogoutModule from 'api/auths-api/logout';

const dispatch = jest.fn();
let getUserInfoSpy: jest.SpyInstance;
let getRefreshTokenSpy: jest.SpyInstance;
let logoutSpy: jest.SpyInstance;

const initialGetState = () => ({
  auths: {
    autoLoggingInState: 'waiting',
    isAutoLoginTried: false,
    loggedOutSuccessfully: false,
  },
});

const loggedInGetState = () => ({
  auths: {
    autoLoggingInState: 'waiting',
    user: {
      userId: 1,
      email: 'xxx@example.com',
      nickname: 'Axel',
    },
    loggedOutSuccessfully: false,
  },
});

const cookiesWithAccessToken = {
  [COOKIE_NAME.hasAccessToken]: 'true',
};

const cookiesWithRefreshToken = {
  [COOKIE_NAME.hasRefreshToken]: 'true',
};

describe('autoLogin', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getUserInfoSpy = jest.spyOn(GetUserInfoModule, 'getUserInfo');
    getRefreshTokenSpy = jest.spyOn(RefreshTokenModule, 'refreshToken');
  });

  it('call loginSuccess if it has access token and getUserInfo API successed', async () => {
    getUserInfoSpy.mockResolvedValue(mockGetUserInfoResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = autoLogin(cookiesWithAccessToken, jest.fn(), jest.fn()) as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[1][0].type).toBe('auths/loginSuccess');
  });

  it('call autoLoginFailure if getUserInfo API failed', async () => {
    getUserInfoSpy.mockRejectedValue(new Error());
    getRefreshTokenSpy.mockResolvedValue({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = autoLogin(cookiesWithAccessToken, jest.fn(), jest.fn()) as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[1][0].type).toBe('auths/autoLoginFailure');
  });

  it('do nothing if user already logged in', async () => {
    getUserInfoSpy.mockResolvedValue(mockGetUserInfoResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = autoLogin(cookiesWithAccessToken, jest.fn(), jest.fn()) as any;
    await appThunk(dispatch, loggedInGetState);

    expect(dispatch.mock.calls).toEqual([]);
  });

  it('call loginSuccess if it has access refresh token and getUserInfo & refreshToken APIs successed', async () => {
    getUserInfoSpy.mockResolvedValue(mockGetUserInfoResponse);
    getRefreshTokenSpy.mockResolvedValue(mockRefreshTokenResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = autoLogin(cookiesWithRefreshToken, jest.fn(), jest.fn()) as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[1][0].type).toBe('auths/loginSuccess');
  });

  it('call autoLoginFailure if it has access & refresh token and refreshToken API failed', async () => {
    getUserInfoSpy.mockRejectedValue(new Error());
    getRefreshTokenSpy.mockResolvedValue({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = autoLogin(cookiesWithRefreshToken, jest.fn(), jest.fn()) as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[1][0].type).toBe('auths/autoLoginFailure');
  });

  it('call autoLoginFailure if it does not have either access or refresh token', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = autoLogin({}, jest.fn(), jest.fn()) as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[1][0].type).toBe('auths/autoLoginFailure');
  });
});

describe('logout', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    logoutSpy = jest.spyOn(LogoutModule, 'logout');
  });

  it('call logoutSuccess if logout API successed', async () => {
    logoutSpy.mockResolvedValue({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = logout(jest.fn()) as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[2][0].type).toBe('auths/logoutSuccess');
  });

  it('call throwError if getUserInfo API failed', async () => {
    logoutSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = logout(jest.fn()) as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[1][0].type).toBe('globalError/throwError');
  });
});
