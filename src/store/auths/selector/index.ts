import { RootState } from 'store';

type AuthsRootState = Pick<RootState, 'auths'>;

export const selectLogginingInState = (state: AuthsRootState) =>
  state.auths.loggingInState;

export const selectUser = (state: AuthsRootState) => state.auths.user;
