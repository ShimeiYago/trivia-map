import { markersSlice } from './../slice/index';
import { AppThunk } from 'store';
import { getRemoteMarkers } from 'api/markers-api';
import { ApiError } from 'api/utils/handle-axios-error';

// basic actions
export const { fetchSuccess, requestFailure, requestStart } =
  markersSlice.actions;

// fetchMarkers action
export const fetchMarkers = (): AppThunk => async (dispatch) => {
  dispatch(requestStart());

  try {
    const res = await getRemoteMarkers();
    dispatch(fetchSuccess(res));
  } catch (error) {
    const apiError = error as ApiError<unknown>;
    dispatch(requestFailure(apiError.errorMsg));
  }
};
