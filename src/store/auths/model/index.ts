import { LoadingState } from 'types/loading-state';
import { User } from 'types/user';

export interface AuthsState {
  loggingInState: LoadingState;
  isAutoLoginTried: boolean;
  user?: User;
}

export const initialState: AuthsState = {
  loggingInState: 'waiting',
  isAutoLoginTried: false,
};
