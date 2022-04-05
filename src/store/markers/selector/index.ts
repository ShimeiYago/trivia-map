import { RootState } from 'store';

type MarkersRootState = Pick<RootState, 'markers'>;

export const selectMarkerList = (state: MarkersRootState) => state.markers.list;
export const selectMarkersLoading = (state: MarkersRootState) =>
  state.markers.loading;
export const selectMarkersErrorMsg = (state: MarkersRootState) =>
  state.markers.errorMsg;
export const selectMarkersTotalPages = (state: MarkersRootState) =>
  state.markers.totalPages;
