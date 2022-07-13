import { AuthsState } from 'store/auths/model';
import { authsReducer, authsSlice } from '..';

const { loginStart, loginSuccess } = authsSlice.actions;

describe('auths reducer', () => {
  const initialState: AuthsState = {
    loggingInState: 'waiting',
  };

  it('should handle initial state', () => {
    expect(authsReducer(undefined, { type: 'unknown' })).toEqual({
      loggingInState: 'waiting',
    });
  });

  it('should handle loginStart', () => {
    const actual = authsReducer(initialState, loginStart());
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
});
