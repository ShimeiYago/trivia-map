import { RootState } from 'store';

type CounterRootState = Pick<RootState, 'counter'>;

export const selectCounterValue = (state: CounterRootState) =>
  state.counter.value;
export const selectCounterLoading = (state: CounterRootState) =>
  state.counter.loading;
export const selectCounterErrorMsg = (state: CounterRootState) =>
  state.counter.errorMsg;
