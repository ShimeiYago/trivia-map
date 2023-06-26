import { selectMarkers } from 'store/markers/selector';
import { markersSlice } from './../slice/index';
import { AppThunk } from 'store';
import { getRemoteMarkers, GetMarkersResponseWithPagination } from 'api/markers-api';
import { throwError } from 'store/global-error/slice';
import { Marker } from 'types/marker';
import { Park } from 'types/park';
import { ApiError } from 'api/utils/handle-axios-error';

// basic actions
export const {
  fetchSuccess,
  fetchStart,
  updateMarkers,
  initializeFetchingState,
  updateTotalPages,
  updateLoadedPages,
  updateFocusingPark,
  updateFilteringCategoryId,
  updateInitMapFocus,
} = markersSlice.actions;

// fetchMarkers action
export const fetchMarkers =
  (park: Park, userId?: number): AppThunk =>
  async (dispatch) => {
    dispatch(updateFocusingPark(park));
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
          res = await getRemoteMarkers({ park, userId });
          totalPages = res.totalPages;
          dispatch(updateTotalPages(totalPages));
        } else {
          res = await getRemoteMarkers({ park, nextUrl, userId });
        }

        dispatch(appendMarkers(res.results));

        loadedPages += 1;
        dispatch(updateLoadedPages(loadedPages));

        nextUrl = res.nextUrl;
      }
      dispatch(fetchSuccess());
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      dispatch(throwError(apiError.status));
    }
  };

// appendMarkers action
export const appendMarkers =
  (newList: Marker[]): AppThunk =>
  (dispatch, getState) => {
    const currentMarkers = selectMarkers(getState());
    const newMarkers = [...currentMarkers, ...newList];
    dispatch(updateMarkers(newMarkers));
  };
