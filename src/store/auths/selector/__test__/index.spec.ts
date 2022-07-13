import { selectLogginingInState, selectUser } from '..';
import { AuthsState } from '../../model';

describe('auths selector', () => {
  const rootState = {
    auths: {
      loggingInState: 'success',
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

  it('selectUser should return user info', () => {
    expect(selectUser(rootState)).toEqual({
      userId: 1,
      email: 'user@example.com',
      nickname: 'Axel',
    });
  });
});
