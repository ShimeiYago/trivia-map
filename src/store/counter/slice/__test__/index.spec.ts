import { counterReducer, counterSlice } from '..';
import { CounterState } from '../../model';

const {
  decrement,
  fetchSuccess,
  increment,
  incrementByAmount,
  postSuccess,
  requestFailure,
  requestStart,
} = counterSlice.actions;

describe('counter reducer', () => {
  const initialState: CounterState = {
    value: 3,
    loading: false,
    errorMsg: null,
  };
  const loadingState = Object.assign(initialState, { loading: true });

  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
      loading: false,
      errorMsg: null,
    });
  });

  it('should handle increment', () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(4);
  });

  it('should handle decrement', () => {
    const actual = counterReducer(initialState, decrement());
    expect(actual.value).toEqual(2);
  });

  it('should handle incrementByAmount', () => {
    const actual = counterReducer(initialState, incrementByAmount(2));
    expect(actual.value).toEqual(5);
  });

  it('should handle requestStart', () => {
    const actual = counterReducer(initialState, requestStart());
    expect(actual.loading).toEqual(true);
  });

  it('should handle requestFailure', () => {
    const actual = counterReducer(loadingState, requestFailure('error'));
    expect(actual.loading).toEqual(false);
    expect(actual.errorMsg).toEqual('error');
  });

  it('should handle fetchSuccess', () => {
    const actual = counterReducer(loadingState, fetchSuccess(10));
    expect(actual.loading).toEqual(false);
    expect(actual.value).toEqual(10);
  });

  it('should handle postSuccess', () => {
    const actual = counterReducer(loadingState, postSuccess());
    expect(actual.loading).toEqual(false);
  });
});
