import { RootState } from 'store';

type MarkersRootState = Pick<RootState, 'markers'>;

export const selectMarkers = (state: MarkersRootState) => state.markers.markers;
export const selectMarkersFetchingState = (state: MarkersRootState) =>
  state.markers.fetchingState;
export const selectMarkersErrorMsg = (state: MarkersRootState) =>
  state.markers.errorMsg;
export const selectMarkersLoadedPages = (state: MarkersRootState) =>
  state.markers.loadedPages;
export const selectMarkersTotalPages = (state: MarkersRootState) =>
  state.markers.totalPages;
