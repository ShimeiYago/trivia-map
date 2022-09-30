import { selectMarkers } from 'store/markers/selector';
import { markersSlice } from './../slice/index';
import { AppThunk } from 'store';
import { getRemoteMarkers, GetMarkersResponseWithPagination } from 'api/markers-api';
import { Marker } from '../model';
import { throwError } from 'store/global-error/slice';
import { Park } from './../../../types/park';

// basic actions
export const {
  fetchSuccess,
  fetchStart,
  updateMarkers,
  updateTotalPages,
  updateLoadedPages,
  updateFocusingPark,
} = markersSlice.actions;

// fetchMarkers action
export const fetchMarkers =
  (park: Park, category?: number): AppThunk =>
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
          res = await getRemoteMarkers({ park, category });
          totalPages = res.totalPages;
          dispatch(updateTotalPages(totalPages));
        } else {
          res = await getRemoteMarkers({ park, nextUrl, category });
        }

        dispatch(appendMarkers(res.results));

        loadedPages += 1;
        dispatch(updateLoadedPages(loadedPages));

        nextUrl = res.nextUrl;
      }
      dispatch(fetchSuccess());
    } catch (error) {
      // TODO: take log of error

      dispatch(throwError(500));
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
