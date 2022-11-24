import {
  selectAutoLoggingInState,
  selectUser,
  selectOpenFormModal,
  selectLoggedOutSuccessfully,
} from '..';
import { AuthsState } from '../../model';

describe('auths selector', () => {
  const rootState = {
    auths: {
      autoLoggingInState: 'success',
      isAutoLoginTried: true,
      user: {
        userId: 1,
        email: 'user@example.com',
        nickname: 'Axel',
        icon: 'https://...',
        isSocialAccount: false,
      },
      errorMsg: 'error',
      openFormModal: true,
      loggedOutSuccessfully: false,
    } as AuthsState,
  };

  it('selectAutoLoggingInState should return autoLoggingInState', () => {
    expect(selectAutoLoggingInState(rootState)).toEqual('success');
  });

  it('selectUser should return user info', () => {
    expect(selectUser(rootState)).toEqual({
      userId: 1,
      email: 'user@example.com',
      nickname: 'Axel',
      icon: 'https://...',
      isSocialAccount: false,
    });
  });

  it('selectOpenFormModal should return openFormModal', () => {
    expect(selectOpenFormModal(rootState)).toEqual(true);
  });

  it('selectLoggedOutSuccessfully should return loggedOutSuccessfully', () => {
    expect(selectLoggedOutSuccessfully(rootState)).toEqual(false);
  });
});
