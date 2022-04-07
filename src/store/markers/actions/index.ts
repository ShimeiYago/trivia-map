import { globalAPIErrorMessage } from 'constant-words/global-api-error-message';
import { selectMarkerList } from 'store/markers/selector';
import { markersSlice } from './../slice/index';
import { AppThunk } from 'store';
import {
  GetMarkersResponse,
  getRemoteMarkers,
  MarkerTypeAPI,
} from 'api/markers-api';
import { ApiError } from 'api/utils/handle-axios-error';

// basic actions
export const {
  fetchSuccess,
  requestFailure,
  requestStart,
  updateList,
  updateTotalPages,
  updateCurrentPageToLoad,
} = markersSlice.actions;

// fetchMarkers action
export const fetchMarkers = (): AppThunk => async (dispatch) => {
  dispatch(requestStart());

  try {
    let pageIndex: number | null = 1;
    let prevPageIndex = 0;
    while (pageIndex && prevPageIndex < pageIndex) {
      const res: GetMarkersResponse = await getRemoteMarkers(pageIndex);

      if (prevPageIndex === 0) {
        dispatch(updateTotalPages(res.totalPages));
      }

      dispatch(appendMarkers(res.markers));
      dispatch(updateCurrentPageToLoad(pageIndex));

      prevPageIndex = pageIndex;
      pageIndex = res.nextPageIndex;
    }
    dispatch(fetchSuccess());
  } catch (error) {
    const apiError = error as ApiError<unknown>;

    const errorMsg = globalAPIErrorMessage(apiError.status, 'get');
    dispatch(requestFailure(errorMsg));
  }
};

// appendMarkers action
export const appendMarkers =
  (newList: MarkerTypeAPI[]): AppThunk =>
  (dispatch, getState) => {
    const markers = [...selectMarkerList(getState()), ...newList];
    dispatch(updateList(markers));
  };
