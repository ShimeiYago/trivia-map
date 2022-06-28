import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { selectMarkers } from 'store/markers/selector';
import { markersSlice } from './../slice/index';
import { AppThunk } from 'store';
import {
  getRemoteMarkers,
  GetMarkersResponseWithPagination,
} from 'api/markers-api';
import { ApiError } from 'api/utils/handle-axios-error';
import { Marker } from '../model';
import {
  concatMarkers as helperConcatMarkers,
  pushMarker as helperPushMarker,
  deleteOneMarker as helperDeleteOneMarker,
} from './helpers';

// basic actions
export const {
  fetchSuccess,
  fetchFailure,
  fetchStart,
  updateMarkers,
  updateTotalPages,
  updateLoadedPages,
} = markersSlice.actions;

// fetchMarkers action
export const fetchMarkers = (): AppThunk => async (dispatch) => {
  dispatch(fetchStart());

  try {
    let nextUrl: string | null = '';
    let totalPages = 1;
    let loadedPages = 0;
    while (nextUrl !== null) {
      if (loadedPages >= totalPages) {
        break;
      }

      let res: GetMarkersResponseWithPagination;
      if (loadedPages === 0) {
        res = await getRemoteMarkers();
        totalPages = res.totalPages;
        dispatch(updateTotalPages(totalPages));
      } else {
        res = await getRemoteMarkers(nextUrl);
      }

      dispatch(appendMarkers(res.results));

      loadedPages += 1;
      dispatch(updateLoadedPages(loadedPages));

      nextUrl = res.nextUrl;
    }
    dispatch(fetchSuccess());
  } catch (error) {
    // TODO: take log of error
    const apiError = error as ApiError<unknown>;

    const errorMsg = globalAPIErrorMessage(apiError.status, 'get');
    dispatch(fetchFailure(errorMsg));
  }
};

// appendMarkers action
export const appendMarkers =
  (newList: Marker[]): AppThunk =>
  (dispatch, getState) => {
    const newMarkers = helperConcatMarkers(selectMarkers(getState()), newList);
    dispatch(updateMarkers(newMarkers));
  };

// pushMarker action
export const pushMarker =
  (newMarker: Marker): AppThunk =>
  (dispatch, getState) => {
    const newMarkers = helperPushMarker(selectMarkers(getState()), newMarker);
    dispatch(updateMarkers(newMarkers));
  };

// deleteOneMarker action
export const deleteOneMarker =
  (deletingMarkerId: number): AppThunk =>
  (dispatch, getState) => {
    const newMarkers = helperDeleteOneMarker(
      selectMarkers(getState()),
      deletingMarkerId,
    );
    dispatch(updateMarkers(newMarkers));
  };
