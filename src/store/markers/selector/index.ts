import { RootState } from 'store';

type MarkersRootState = Pick<RootState, 'markers'>;

export const selectMarkersDict = (state: MarkersRootState) =>
  state.markers.markers;
export const selectMarkersFetchingState = (state: MarkersRootState) =>
  state.markers.fetchingState;
export const selectMarkersErrorMsg = (state: MarkersRootState) =>
  state.markers.errorMsg;
export const selectMarkersLoadedRecords = (state: MarkersRootState) =>
  state.markers.loadedRecords;
export const selectMarkersTotalRecords = (state: MarkersRootState) =>
  state.markers.totalRecords;
export const selectMarkersDeletingState = (state: MarkersRootState) =>
  state.markers.deletingState;
