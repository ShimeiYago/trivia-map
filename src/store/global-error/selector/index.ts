import { RootState } from 'store';

type GlobalErrorRootState = Pick<RootState, 'globalError'>;

export const selectGlobalErrorStatus = (state: GlobalErrorRootState) =>
  state.globalError.status;
