import { selectMarkers } from 'store/markers/selector';
import { markersSlice } from './../slice/index';
import { AppThunk } from 'store';
import { getRemoteMarkers, GetMarkersResponseWithPagination } from 'api/markers-api';
import { Marker } from '../model';
import {
  concatMarkers as helperConcatMarkers,
  pushMarker as helperPushMarker,
  deleteOneMarker as helperDeleteOneMarker,
} from './helpers';
import { throwError } from 'store/global-error/slice';
import { Park } from './../../../types/park';

// basic actions
export const { fetchSuccess, fetchStart, updateMarkers, updateTotalPages, updateLoadedPages } =
  markersSlice.actions;

// fetchMarkers action
export const fetchMarkers =
  (park: Park, category?: number): AppThunk =>
  async (dispatch) => {
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
    const newMarkers = helperDeleteOneMarker(selectMarkers(getState()), deletingMarkerId);
    dispatch(updateMarkers(newMarkers));
  };
