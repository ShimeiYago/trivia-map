import { LoadingState } from 'types/loading-state';
import { User } from 'types/user';

export interface AuthsState {
  autoLoggingInState: LoadingState;
  user?: User;
  openFormModal: boolean;
}

export const initialState: AuthsState = {
  autoLoggingInState: 'waiting',
  openFormModal: false,
};
