import {
  selectIsAutoLoginTried,
  selectLogginingInState,
  selectUser,
  selectOpenFormModal,
} from '..';
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
      openFormModal: true,
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

  it('selectOpenFormModal should return openFormModal', () => {
    expect(selectOpenFormModal(rootState)).toEqual(true);
  });
});
