import { RootState } from 'store';

type AuthsRootState = Pick<RootState, 'auths'>;

export const selectLogginingInState = (state: AuthsRootState) =>
  state.auths.loggingInState;

export const selectIsAutoLoginTried = (state: AuthsRootState) =>
  state.auths.isAutoLoginTried;

export const selectUser = (state: AuthsRootState) => state.auths.user;

export const selectOpenFormModal = (state: AuthsRootState) =>
  state.auths.openFormModal;
