import { LoadingState } from 'types/loading-state';
import { User } from 'types/user';

export interface AuthsState {
  loggingInState: LoadingState;
  user?: User;
  openFormModal: boolean;
}

export const initialState: AuthsState = {
  loggingInState: 'waiting',
  openFormModal: false,
};
