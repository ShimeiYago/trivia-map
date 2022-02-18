import { AppThunk } from 'store';
import { counterSlice } from '../slice';
import { selectCounterValue } from '../selector';
import { getRemoteCount, postRemoteCount } from 'api/counter-api';
import { ApiError } from 'api/utils/handle-axios-error';

// basic actions
export const {
  increment,
  decrement,
  incrementByAmount,
  requestStart,
  requestFailure,
  fetchSuccess,
  postSuccess,
} = counterSlice.actions;

// fetchCount action
export const fetchCount = (): AppThunk => async (dispatch) => {
  dispatch(requestStart());

  try {
    const res = await getRemoteCount();
    dispatch(fetchSuccess(res.count));
  } catch (error) {
    const apiError = error as ApiError<unknown>;
    dispatch(requestFailure(apiError.errorMsg));
  }
};

// postCount action
export const postCount = (): AppThunk => async (dispatch, getState) => {
  dispatch(requestStart());

  const count = selectCounterValue(getState());

  try {
    await postRemoteCount(count);
    dispatch(postSuccess());
  } catch (error) {
    const apiError = error as ApiError<unknown>;
    dispatch(requestFailure(apiError.errorMsg));
  }
};

// incrementIfOdd action
export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCounterValue(getState());
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount));
    }
  };
