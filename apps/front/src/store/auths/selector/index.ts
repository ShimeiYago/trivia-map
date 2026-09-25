import { RootState } from 'store';

type AuthsRootState = Pick<RootState, 'auths'>;

export const selectAutoLoggingInState = (state: AuthsRootState) => state.auths.autoLoggingInState;

export const selectUser = (state: AuthsRootState) => state.auths.user;

export const selectOpenFormModal = (state: AuthsRootState) => state.auths.openFormModal;

export const selectLoggedOutSuccessfully = (state: AuthsRootState) =>
  state.auths.loggedOutSuccessfully;
