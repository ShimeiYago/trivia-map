import { autoLogin, refreshTokenAndGetUserInfo } from '..';
import * as GetUserInfoModule from 'api/auths-api/get-user-info';
import * as RefreshTokenModule from 'api/auths-api/refresh-token';
import { User } from 'types/user';

const dispatch = jest.fn();
let getUserInfoSpy: jest.SpyInstance;
let getRefreshTokenSpy: jest.SpyInstance;

const mockResponse: User = {
  userId: 1,
  email: 'xxx@example.com',
  nickname: 'Axel',
};

const initialGetState = () => ({
  auths: {
    autoLoggingInState: 'waiting',
    isAutoLoginTried: false,
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
  },
});

describe('autoLogin', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getUserInfoSpy = jest.spyOn(GetUserInfoModule, 'getUserInfo');
    getRefreshTokenSpy = jest.spyOn(RefreshTokenModule, 'refreshToken');
  });

  it('call loginSuccess if getUserInfo API successed', async () => {
    getUserInfoSpy.mockResolvedValue(mockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = autoLogin() as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[1][0].type).toBe('auths/loginSuccess');
  });

  it('call autoLoginFailure if getUserInfo API failed', async () => {
    getUserInfoSpy.mockRejectedValue(new Error());
    getRefreshTokenSpy.mockResolvedValue({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = autoLogin() as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[1][0].type).toBe(undefined);
  });

  it('do nothing if user already logged in', async () => {
    getUserInfoSpy.mockResolvedValue(mockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = autoLogin() as any;
    await appThunk(dispatch, loggedInGetState);

    expect(dispatch.mock.calls).toEqual([]);
  });
});

describe('refreshTokenAndGetUserInfo', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getUserInfoSpy = jest.spyOn(GetUserInfoModule, 'getUserInfo');
    getRefreshTokenSpy = jest.spyOn(RefreshTokenModule, 'refreshToken');
  });

  it('call loginSuccess if getUserInfo & refreshToken APIs successed', async () => {
    getUserInfoSpy.mockResolvedValue(mockResponse);
    getRefreshTokenSpy.mockResolvedValue({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = refreshTokenAndGetUserInfo() as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[0][0].type).toBe('auths/loginSuccess');
  });

  it('call autoLoginFailure if getUserInfo API failed', async () => {
    getUserInfoSpy.mockRejectedValue(new Error());
    getRefreshTokenSpy.mockResolvedValue({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = refreshTokenAndGetUserInfo() as any;
    await appThunk(dispatch, initialGetState);

    expect(dispatch.mock.calls[0][0].type).toBe('auths/autoLoginFailure');
  });
});
