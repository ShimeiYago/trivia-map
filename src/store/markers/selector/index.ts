import { RootState } from 'store';

type MarkersRootState = Pick<RootState, 'markers'>;

export const selectMarkers = (state: MarkersRootState) => state.markers.markers;
export const selectMarkersFetchingState = (state: MarkersRootState) => state.markers.fetchingState;
export const selectMarkersLoadedPages = (state: MarkersRootState) => state.markers.loadedPages;
export const selectMarkersTotalPages = (state: MarkersRootState) => state.markers.totalPages;
export const selectFocusingPark = (state: MarkersRootState) => state.markers.focusingPark;
export const selectFilteringCategoryId = (state: MarkersRootState) =>
  state.markers.filteringCategoryId;
export const selectInitZoomCenter = (state: MarkersRootState) => state.markers.initZoomCenter;
