import { MarkerDict } from './../model/index';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { selectMarkersDict } from 'store/markers/selector';
import { markersSlice } from './../slice/index';
import { AppThunk } from 'store';
import {
  GetMarkersResponse,
  getRemoteMarkers,
  MarkerTypeAPI,
} from 'api/markers-api';
import { ApiError } from 'api/utils/handle-axios-error';
import { deleteRemoteArticle } from 'api/articles-api/delete-remote-article';

// basic actions
export const {
  fetchSuccess,
  fetchFailure,
  fetchStart,
  updateMarkers,
  updateTotalPages,
  updateCurrentPageToLoad,
  deleteStart,
  deleteSuccess,
  deleteFailure,
} = markersSlice.actions;

// fetchMarkers action
export const fetchMarkers = (): AppThunk => async (dispatch) => {
  dispatch(fetchStart());

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
    // TODO: take log of error
    const apiError = error as ApiError<unknown>;

    const errorMsg = globalAPIErrorMessage(apiError.status, 'get');
    dispatch(fetchFailure(errorMsg));
  }
};

// appendMarkers action
export const appendMarkers =
  (newList: MarkerTypeAPI[]): AppThunk =>
  (dispatch, getState) => {
    const newMarkers: MarkerDict = Object.assign(
      { ...selectMarkersDict(getState()) },
      ...newList.map((marker) => ({
        [marker.postId]: { title: marker.title, position: marker.position },
      })),
    );

    dispatch(updateMarkers(newMarkers));
  };

// removeMarkerFromDict action
export const removeMarkerInDict =
  (postId: string): AppThunk =>
  (dispatch, getState) => {
    const newMarkers: MarkerDict = { ...selectMarkersDict(getState()) };
    delete newMarkers[postId];
    dispatch(updateMarkers(newMarkers));
  };

// deleteArticle action
export const deleteArticle =
  (postId: string): AppThunk =>
  async (dispatch) => {
    dispatch(deleteStart());
    try {
      await deleteRemoteArticle(postId);
      dispatch(removeMarkerInDict(postId));
      dispatch(deleteSuccess());
    } catch (error) {
      // TODO: take log of error
      const apiError = error as ApiError<unknown>;

      const errorMsg = globalAPIErrorMessage(apiError.status, 'delete');
      dispatch(deleteFailure(errorMsg));
    }
  };
