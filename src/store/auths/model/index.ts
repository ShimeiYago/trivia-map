import { LoadingState } from 'types/loading-state';
import { User } from 'types/user';

export interface AuthsState {
  loggingInState: LoadingState;
  user?: User;
}

export const initialState: AuthsState = {
  loggingInState: 'waiting',
};
