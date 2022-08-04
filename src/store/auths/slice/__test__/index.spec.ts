import { AuthsState } from 'store/auths/model';
import { authsReducer, authsSlice } from '..';

const {
  autoLoginStart,
  loginSuccess,
  autoLoginFailure,
  toggleFormModal,
  updateUser,
  logoutStart,
  logoutSuccess,
} = authsSlice.actions;

describe('auths reducer', () => {
  const initialState: AuthsState = {
    autoLoggingInState: 'waiting',
    openFormModal: false,
    loggedOutSuccessfully: false,
  };

  it('should handle initial state', () => {
    expect(authsReducer(undefined, { type: 'unknown' })).toEqual({
      autoLoggingInState: 'waiting',
      openFormModal: false,
      loggedOutSuccessfully: false,
    });
  });

  it('should handle autoLoginStart', () => {
    const actual = authsReducer(initialState, autoLoginStart());
    expect(actual.autoLoggingInState).toEqual('loading');
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

  it('should handle updateUser', () => {
    const actual = authsReducer(
      initialState,
      updateUser({
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
    expect(actual.autoLoggingInState).toEqual('error');
  });

  it('should handle toggleFormModal', () => {
    const actual = authsReducer(initialState, toggleFormModal(true));
    expect(actual.openFormModal).toEqual(true);
  });

  it('should handle logoutStart', () => {
    const actual = authsReducer(initialState, logoutStart());
    expect(actual.loggedOutSuccessfully).toEqual(false);
  });

  it('should handle logoutSuccess', () => {
    const actual = authsReducer(initialState, logoutSuccess());
    expect(actual.loggedOutSuccessfully).toEqual(true);
  });
});
