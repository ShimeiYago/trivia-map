import { RootState } from 'store';

type MarkersRootState = Pick<RootState, 'markers'>;

export const selectMarkersDict = (state: MarkersRootState) =>
  state.markers.markers;
export const selectMarkersFetchingState = (state: MarkersRootState) =>
  state.markers.fetchingState;
export const selectMarkersErrorMsg = (state: MarkersRootState) =>
  state.markers.errorMsg;
export const selectMarkersCurrentPageToLoad = (state: MarkersRootState) =>
  state.markers.currentPageToLoad;
export const selectMarkersTotalPages = (state: MarkersRootState) =>
  state.markers.totalPages;
