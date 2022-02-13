import { markersSlice } from './../slice/index';
import { AppDispatch } from 'store';
import { getRemoteMarkers } from 'api/markers-api';
import { ApiError } from 'api/utils/handle-axios-error';

// basic actions
export const { fetchSuccess, requestFailure, requestStart } =
  markersSlice.actions;

// fetchMarkers action
export const fetchMarkers = () => async (dispatch: AppDispatch) => {
  dispatch(requestStart());

  try {
    const res = await getRemoteMarkers();
    dispatch(fetchSuccess(res));
  } catch (error) {
    const apiError = error as ApiError;
    dispatch(requestFailure(apiError.errorMsg));
  }
};
