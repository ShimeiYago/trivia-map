import { AuthsState } from 'store/auths/model';
import { authsReducer, authsSlice } from '..';

const { autoLoginStart, loginSuccess, autoLoginFailure } = authsSlice.actions;

describe('auths reducer', () => {
  const initialState: AuthsState = {
    loggingInState: 'waiting',
    isAutoLoginTried: false,
  };

  it('should handle initial state', () => {
    expect(authsReducer(undefined, { type: 'unknown' })).toEqual({
      loggingInState: 'waiting',
      isAutoLoginTried: false,
    });
  });

  it('should handle autoLoginStart', () => {
    const actual = authsReducer(initialState, autoLoginStart());
    expect(actual.loggingInState).toEqual('loading');
  });

  it('should handle loginSuccess', () => {
    const actual = authsReducer(
      initialState,
      loginSuccess({
        userId: 1,
        email: 'user@example.com',
        nickname: 'Axel',
      }),
    );
    expect(actual.user).toEqual({
      userId: 1,
      email: 'user@example.com',
      nickname: 'Axel',
    });
  });

  it('should handle autoLoginFailure', () => {
    const actual = authsReducer(initialState, autoLoginFailure());
    expect(actual.loggingInState).toEqual('waiting');
  });
});
