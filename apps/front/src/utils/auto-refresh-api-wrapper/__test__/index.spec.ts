import { autoRefreshApiWrapper } from '..';
import * as RefreshTokenApiModule from 'api/auths-api/refresh-token';

let refreshTokenSpy: jest.SpyInstance;

describe('autoRefreshApiWrapper', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    refreshTokenSpy = jest.spyOn(RefreshTokenApiModule, 'refreshToken');
  });

  it('return response of parameter api', async () => {
    const res = await autoRefreshApiWrapper<number>(() => Promise.resolve(1), jest.fn());
    expect(res).toBe(1);
  });

  it('throw error of parameter api', async () => {
    const myError = {
      status: 500,
    };

    expect(
      autoRefreshApiWrapper<unknown>(() => Promise.reject(myError), jest.fn()),
    ).rejects.toEqual(myError);
  });

  it('call refreshToken if api throw 401 error', async () => {
    refreshTokenSpy.mockResolvedValue({});

    const myError = {
      status: 401,
    };

    expect(
      autoRefreshApiWrapper<unknown>(() => Promise.reject(myError), jest.fn()),
    ).rejects.toEqual(myError);
  });

  it('throw api error if main api throw 401 error and refreshToken fail', async () => {
    refreshTokenSpy.mockRejectedValue({});

    const myError = {
      status: 401,
    };

    expect(
      autoRefreshApiWrapper<unknown>(() => Promise.reject(myError), jest.fn()),
    ).rejects.toEqual(myError);
  });

  it('refresh user info if main api throw 401 error and refreshToken fail with 401', async () => {
    refreshTokenSpy.mockRejectedValue({ status: 401 });
    const deleteUserInfo = jest.fn();

    const myError = {
      status: 401,
    };

    expect(
      autoRefreshApiWrapper<unknown>(
        () => Promise.reject(myError),
        () => deleteUserInfo,
      ),
    ).rejects.toEqual(myError);
  });
});
