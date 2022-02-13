import {
  selectCounterErrorMsg,
  selectCounterLoading,
  selectCounterValue,
} from '..';
import { CounterState } from '../../model';

describe('counter selector', () => {
  const rootState = {
    counter: {
      value: 3,
      loading: false,
      errorMsg: 'error',
    } as CounterState,
  };

  it('selectCounterValue should return counter value', () => {
    expect(selectCounterValue(rootState)).toEqual(3);
  });

  it('selectCounterLoading should return counter loading state', () => {
    expect(selectCounterLoading(rootState)).toEqual(false);
  });

  it('selectCounterValue should return counter error meseage', () => {
    expect(selectCounterErrorMsg(rootState)).toEqual('error');
  });
});
