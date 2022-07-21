import { selectIsAutoLoginTried, selectLogginingInState, selectUser } from '..';
import { AuthsState } from '../../model';

describe('auths selector', () => {
  const rootState = {
    auths: {
      loggingInState: 'success',
      isAutoLoginTried: true,
      user: {
        userId: 1,
        email: 'user@example.com',
        nickname: 'Axel',
      },
      errorMsg: 'error',
    } as AuthsState,
  };

  it('selectLogginingInState should return loggingInState', () => {
    expect(selectLogginingInState(rootState)).toEqual('success');
  });

  it('selectIsAutoLoginTried should return isAutoLoginTried', () => {
    expect(selectIsAutoLoginTried(rootState)).toEqual(true);
  });

  it('selectUser should return user info', () => {
    expect(selectUser(rootState)).toEqual({
      userId: 1,
      email: 'user@example.com',
      nickname: 'Axel',
    });
  });
});
